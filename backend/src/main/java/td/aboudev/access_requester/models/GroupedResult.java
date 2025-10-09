package td.aboudev.access_requester.models;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class GroupedResult {
    private final String groupKey;
    private final Long count;

    public GroupedResult(String groupKey, Long count) {
        this.groupKey = groupKey;
        this.count = count;
    }

    public GroupedResult(Boolean groupKey, Long count) {
        this.groupKey = groupKey == null ? "unknow" : (groupKey ? "enabled" : "disabled");
        this.count = count;
    }
}
