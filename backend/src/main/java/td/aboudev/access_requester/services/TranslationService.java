package td.aboudev.access_requester.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class TranslationService {
    private final MessageSource messageSource;

    public String trans(String messageCode) {
        var request = getCurrentHttpRequest();
        Locale locale = null;
        if (request != null) {
            locale = getCurrentHttpRequest().getLocale();
        }
        if (locale == null)
            locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(messageCode, null, locale);
    }

    public String trans(String messageCode, Object[] args) {
        var request = getCurrentHttpRequest();
        Locale locale = null;
        if (request != null) {
            locale = getCurrentHttpRequest().getLocale();
        }
        if (locale == null)
            locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(messageCode, args, locale);
    }

    private static HttpServletRequest getCurrentHttpRequest() {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes instanceof ServletRequestAttributes) {
            return ((ServletRequestAttributes) requestAttributes).getRequest();
        }
        return null;
    }
}
