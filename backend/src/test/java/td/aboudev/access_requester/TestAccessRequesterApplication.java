package td.aboudev.access_requester;

import org.springframework.boot.SpringApplication;

public class TestAccessRequesterApplication {

	public static void main(String[] args) {
		SpringApplication.from(AccessRequesterApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
