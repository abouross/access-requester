package td.aboudev.access_requester.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import td.aboudev.access_requester.entities.User;

public class UserDto {
    @Getter
    @AllArgsConstructor
    public static class List {
        protected final Long id;
        protected final String username;
        protected final String firstName;
        protected final String lastName;
        protected final Boolean enabled;
        protected final String displayName;

        public static List newInstance(User user) {
            return new List(
                    user.getId(),
                    user.getUsername(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEnabled(),
                    user.display()
            );
        }
    }

    @Getter
    public static class Details extends List {
        private final String email;
        private final String title;
        private final String department;
        private final java.util.List<String> roles;

        public Details(Long id, String username, String firstName, String lastName, Boolean enabled, String display, String email, String title, String department, java.util.List<String> roles) {
            super(id, username, firstName, lastName, enabled, display);
            this.email = email;
            this.title = title;
            this.department = department;
            this.roles = roles;
        }

        public static Details newInstance(User user) {
            return new Details(
                    user.getId(),
                    user.getUsername(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEnabled(),
                    user.display(),
                    user.getEmail(),
                    user.getTitle(),
                    user.getDepartment(),
                    user.getRoles()
            );
        }
    }
}
