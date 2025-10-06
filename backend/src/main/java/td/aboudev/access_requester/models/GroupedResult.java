package td.aboudev.access_requester.models;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class GroupedResult {
    private final String groupKey;
    private final Long count;

    public GroupedResult(Boolean groupKey, Long count) {
        this.groupKey = groupKey == null ? "user.status.unknow" : (groupKey ? "user.status.enabled" : "user.status.disabled");
        this.count = count;
    }
}
