package com.soundbridge.domain.member.oauth;

import com.soundbridge.domain.member.entity.Member;
import com.soundbridge.domain.member.repository.MemberRepository;
import com.soundbridge.domain.member.service.TokenService;
import com.soundbridge.domain.sentence.entity.Category;
import com.soundbridge.domain.sentence.entity.QuickSentence;
import com.soundbridge.domain.sentence.repository.CategoryRepository;
import com.soundbridge.domain.sentence.repository.QuickSentenceRepository;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final TokenService tokenService;
    private final MemberRepository memberRepository;
    private final CategoryRepository categoryRepository;
    private final QuickSentenceRepository quickSentenceRepository;
    //    private final RefreshTokenRepository refreshTokenRepository;
    private final RedisTemplate redisTemplate;
    @Value("${LOGIN_SUCCESS_URL}")
    private String loginSuccessUrl;

    @Value("${jwt.refresh-token.expire-length}")
    private long refreshTokenExpiretime;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        log.info("attributes {}", attributes);

        Member member = memberRepository.findByEmail((String) attributes.get("email"));

        if (member == null) { //회원 가입.
            member = Member.builder()
                .email((String) attributes.get("email"))
                .nickname((String) attributes.get("nickname"))
                .gender((String) attributes.get("gender"))
                .profile((String) attributes.get("profile"))
                .age((int) attributes.get("age"))
                .build();

            Member save = memberRepository.save(member);

            Category category = Category.builder()
                .categoryCount(0)
                .categoryName("인사")
                .member(save)
                .build();

            Category category1 = categoryRepository.save(category);

            String[] quickSentence = {"안녕하세요", "안녕", "잘가", "다음에 뵙겠습니다."};

            for (String qs : quickSentence) {
                QuickSentence quickSentence1 = QuickSentence.builder()
                    .sentence(qs)
                    .category(category1)
                    .build();
                quickSentenceRepository.save(quickSentence1);
            }
        }

        if (member.getDelFlag() == 1) { //재 가입 불가능 throw 던지기, Filter ExceptionHandler 작성

            return;
        }

        Token token = tokenService.generateToken(member.getId(), "USER");
        log.info("JwT : {}", token);
        Cookie cookie = new Cookie("refresh-token", token.getRefreshToken());
        // expires in 7 days
        cookie.setMaxAge(60 * 60 * 24 * 14);
        // optional properties
        cookie.setSecure(true);
        cookie.setHttpOnly(true);
        cookie.setPath("/api/token/tokenReissue");

        // add cookie to response
        response.addCookie(cookie);

        redisTemplate.opsForValue() //redis에 refreshToken 저장
            .set(member.getEmail(),
                token.getRefreshToken(),
                refreshTokenExpiretime, //만료 기간
                TimeUnit.MILLISECONDS);

//        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.add("Authorization", "Bearer " + token.getToken());

        response.sendRedirect(loginSuccessUrl + "Bearer " + token.getToken());
    }

}