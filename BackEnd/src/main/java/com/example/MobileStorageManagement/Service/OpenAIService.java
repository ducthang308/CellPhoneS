package com.example.MobileStorageManagement.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    private static final String API_URL = "https://api.openai.com/v1/chat/completions";

    /* ===== MODE A: KIẾN THỨC CHUNG ===== */
    public String answerGeneral(String message) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", model);
            payload.put("temperature", 0.5);
            payload.put("max_tokens", 300);

            payload.put("messages", List.of(
                    Map.of("role", "system",
                            "content", "Bạn là chuyên gia về điện thoại. Trả lời kiến thức chung, KHÔNG nêu giá bán."),
                    Map.of("role", "user",
                            "content", message)
            ));

            JsonNode response = callOpenAI(payload);
            return response.at("/choices/0/message/content").asText();

        } catch (Exception e) {
            return "Mình gặp lỗi khi trả lời, bạn thử lại nhé.";
        }
    }

    /* ===== MODE B: TƯ VẤN MUA BÁN ===== */
    public String advise(String message, List<Map<String, Object>> phones) {
        try {
            String systemPrompt = """
                Bạn là nhân viên tư vấn bán điện thoại.
                QUY TẮC:
                - CHỈ tư vấn dựa trên danh sách điện thoại được cung cấp.
                - KHÔNG bịa sản phẩm, KHÔNG bịa giá.
                - Nếu không có máy phù hợp, hãy nói rõ và hỏi thêm 1 câu.
                - Trả lời tiếng Việt, thân thiện, đúng kiểu bán hàng.
                """;

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", model);
            payload.put("temperature", 0.4);
            payload.put("max_tokens", 300);

            payload.put("messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user",
                            "content",
                            "KHÁCH HỎI:\n" + message +
                                    "\n\nDANH SÁCH ĐIỆN THOẠI (nguồn duy nhất):\n" +
                                    mapper.writeValueAsString(phones))
            ));

            JsonNode response = callOpenAI(payload);
            return response.at("/choices/0/message/content").asText();

        } catch (Exception e) {
            return "Hiện mình chưa tìm được máy phù hợp, bạn cho thêm thông tin nhé.";
        }
    }

    /* ===== CALL API ===== */
    private JsonNode callOpenAI(Map<String, Object> payload) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                API_URL, request, String.class);

        return mapper.readTree(response.getBody());
    }
}
