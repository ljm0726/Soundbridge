package com.soundbridge.domain.pronunciation.response;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class BasicLetterRes {
    private Long basicLetterId;
    private String letter;
    private String guidLetter;
    private String letterImage;
    private String guidImage;
    private int tryCount;
    private int successCount;
    private String startTime;
    private String explanation;

    @QueryProjection
    public BasicLetterRes(Long basicLetterId, String letter, String guidLetter, String letterImage, String guidImage, int tryCount, int successCount, String startTime, String explanation) {
        this.basicLetterId = basicLetterId;
        this.letter = letter;
        this.guidLetter = guidLetter;
        this.letterImage = letterImage;
        this.guidImage = guidImage;
        this.tryCount = tryCount;
        this.successCount = successCount;
        this.startTime = startTime;
        this.explanation = explanation;
    }
}
