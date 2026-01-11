package com.example.MobileStorageManagement.Controller;


import com.example.MobileStorageManagement.Service.OpenAIService;
import com.example.MobileStorageManagement.Service.PhoneSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/ai")
public class PhoneChatController {

    private final PhoneSearchService searchService;
    private final OpenAIService openAIService;

    @PostMapping("/phone-chat")
    public Map<String, Object> chat(@RequestBody Map<String, String> body) {

        String message = body.get("message");

        if (isGeneralQuestion(message)) {
            return Map.of(
                    "reply", openAIService.answerGeneral(message),
                    "products", List.of()
            );
        }

        List<Map<String, Object>> phones = searchService.search(message);
        String reply = openAIService.advise(message, phones);

        return Map.of(
                "reply", reply,
                "products", phones
        );
    }

    private boolean isGeneralQuestion(String message) {
        String text = message.toLowerCase();

        List<String> keywords = List.of(
                "bao nhiêu dòng",
                "mấy dòng",
                "gồm những",
                "là gì",
                "khác nhau",
                "phân biệt",
                "so với"
        );

        return keywords.stream().anyMatch(text::contains);
    }
}
