package td.aboudev.access_requester.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Objects;

public class PageModel<T> {
    private final Page<T> page;

    /**
     * Creates a new {@link PageModel} for the given {@link Page}.
     *
     * @param page must not be {@literal null}.
     */
    public PageModel(Page<T> page) {

        Assert.notNull(page, "Page must not be null");

        this.page = page;
    }

    @JsonProperty
    public List<T> getContent() {
        return page.getContent();
    }

    @JsonProperty("page")
    public PageMetadata getMetadata() {
        return new PageMetadata(page.getSize(), page.getNumber(), page.getNumberOfElements(), page.getTotalElements(),
                page.getTotalPages());
    }

    @JsonProperty("sort")
    public SortMetadata getSortMetadata() {
        Sort sort = page.getSort();
        return new SortMetadata(
                sort.isSorted(),
                sort.stream().map(order -> new Order(order.getProperty(), order.getDirection()))
                        .toList()
        );
    }

    @Override
    public boolean equals(Object obj) {

        if (this == obj) {
            return true;
        }

        if (!(obj instanceof PageModel<?> that)) {
            return false;
        }

        return Objects.equals(this.page, that.page);
    }

    @Override
    public int hashCode() {
        return Objects.hash(page);
    }

    public record PageMetadata(long size, long number, long numberOfElements, long totalElements,
                               long totalPages) {

        public PageMetadata {
            Assert.isTrue(size > -1, "Size must not be negative!");
            Assert.isTrue(number > -1, "Number must not be negative!");
            Assert.isTrue(totalElements > -1, "Total elements must not be negative!");
            Assert.isTrue(totalPages > -1, "Total pages must not be negative!");
            Assert.isTrue(numberOfElements > -1, "Number of elements must not be negative!");
        }
    }

    public record SortMetadata(boolean isSorted, List<Order> orders) {
    }

    public record Order(String field, Sort.Direction direction) {
    }
}


