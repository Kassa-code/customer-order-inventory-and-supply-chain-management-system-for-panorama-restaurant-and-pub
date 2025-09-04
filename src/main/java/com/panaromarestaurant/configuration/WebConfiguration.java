package com.panaromarestaurant.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration // Marks this class as a configuration class for Spring
@EnableWebSecurity // Enables Spring Security in the application
public class WebConfiguration {

    // Define a SecurityFilterChain bean to customize Spring Security behavior
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Configure access rules for HTTP requests
                .authorizeHttpRequests(auth -> {
                    auth
                            // Allow all users (even unauthenticated) to access static resources (CSS, JS,
                            // Images, etc.)
                            .requestMatchers("/static/**", "/css/**", "/images/**", "/js/**", "/bootstrap-5.2.3/**",
                                    "/fontawesome-free-6.6.0/**", "/jQuery/**", "/datatables-2.1.8/**")
                            .permitAll()

                            // Allow all users (even unauthenticated) to access the homepage and login from
                            // there
                            .requestMatchers("/index/**").permitAll()

                            // Allow all users (even unauthenticated) to access the login page
                            .requestMatchers("/login").permitAll()

                            // Allow all users (authenticated or not) to access the /createadmin URL
                            .requestMatchers("/createadmin").permitAll()

                            // Allow only users with these specific roles to access the dashboard
                            .requestMatchers("/dashboard").hasAnyAuthority(
                                    "Admin", "Manager", "Assistant Manager", "Cashier", "Receptionist", "Cheff",
                                    "Barman")

                            .requestMatchers("/administration/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/employee/**").hasAnyAuthority("Admin", "Manager", "Cashier")

                            // Allow only Admin and Manager roles to access any URLs under /privilage/
                            // (Privilege management section)
                            .requestMatchers("/privilage/**").hasAnyAuthority("Admin", "Manager")

                            // Allow only Admin and Manager roles to access any URLs under /user/
                            // (User account management section)
                            .requestMatchers("/user/**").hasAnyAuthority("Admin", "Manager")

                            // Allow Admin, Manager, and Cashier to access item-related URLs
                            // (Inventory or item management)
                            .requestMatchers("/ingredient/**").hasAnyAuthority("Admin", "Manager", "Cheff")

                            // Allow Admin, Manager, and Cashier to access related URLs
                            // (Supplier)
                            .requestMatchers("/supplier/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/purchaseorder/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/goodreceivenote/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/supplierpayment/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/submenu/**").hasAnyAuthority("Admin", "Manager", "Cashier", "Cheff")

                            .requestMatchers("/inventory/**").hasAnyAuthority("Admin", "Manager", "Cheff")

                            .requestMatchers("/garbageremove/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/dailyoutstock/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/liquormenu/**").hasAnyAuthority("Admin", "Manager", "Cashier", "Cheff")

                            .requestMatchers("/menu/**").hasAnyAuthority("Admin", "Manager", "Cashier", "Cheff")

                            .requestMatchers("/customerpayment/**").hasAnyAuthority("Admin", "Manager", "Cashier")

                            .requestMatchers("/delivery/**").hasAnyAuthority("Admin", "Manager", "Cashier")

                            .requestMatchers("/deliverymanagement/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/dinein/**").hasAnyAuthority("Admin", "Manager", "Cashier")

                            .requestMatchers("/inventorymanagement/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/kitchen/**").hasAnyAuthority("Admin", "Manager", "Cheff")

                            .requestMatchers("/menumanagement/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/menuview/**").hasAnyAuthority("Admin", "Manager", "Cashier")

                            .requestMatchers("/order/**").hasAnyAuthority("Admin", "Manager", "Cashier", "Cheff")

                            .requestMatchers("/purchasesupplier/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/reportsmanagement/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/suppliermanagement/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/supplierpaymentreport/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/userprofile/**")
                            .hasAnyAuthority("Admin", "Manager", "Cashier", "Cheff", "Barman")

                            .requestMatchers("/vehicle/**").hasAnyAuthority("Admin", "Manager", "Cashier")

                            .requestMatchers("/pickupview/**").hasAnyAuthority("Admin", "Manager", "Cashier")

                            .requestMatchers("/deliveryview/**").hasAnyAuthority("Admin", "Manager", "Cashier")

                            .requestMatchers("/takeawayview/**").hasAnyAuthority("Admin", "Manager", "Cashier")

                            .requestMatchers("/dineinordersview/**").hasAnyAuthority("Admin", "Manager", "Cashier")

                            .requestMatchers("/allordersview/**").hasAnyAuthority("Admin", "Manager", "Cashier")

                            .requestMatchers("/customerpaymentreport/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/customerpaymentbycardreport/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/customerpaymentreportbycash/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/inventoryreportbyitem/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/dailysalesreport/**").hasAnyAuthority("Admin", "Manager")

                            .requestMatchers("/dailysalesreportbyitem/**").hasAnyAuthority("Admin", "Manager")

                            // Require authentication for any other requests not explicitly mentioned
                            .anyRequest().authenticated();

                })

                // Set up form-based login configuration
                .formLogin(login -> {
                    login
                            // Custom login page URL (must be handled by your controller/view)
                            .loginPage("/login")

                            // Redirect here after successful login
                            .defaultSuccessUrl("/dashboard", true)

                            // Redirect here if login fails (you can show an error message with this URL)
                            .failureUrl("/login?error=userpasswordError")

                            // Define the form field name for the username
                            .usernameParameter("username")

                            // Define the form field name for the password
                            .passwordParameter("password");

                })

                // Set up logout configuration
                .logout(logout -> {
                    logout
                            // URL used to trigger logout (should be a POST request)
                            .logoutUrl("/logout")

                            // Redirect here after successful logout
                            .logoutSuccessUrl("/login");
                })

                // Set up handling for access-denied situations
                .exceptionHandling(exp -> {
                    // If a user tries to access a resource they don't have permission for, redirect
                    // here
                    exp.accessDeniedPage("/errorpage");
                })

                // Disable CSRF protection (only do this if you're sure it's safe in your use
                // case)
                .csrf(csrf -> {
                    csrf.disable();
                });

        // Build and return the configured security filter chain
        return http.build();
    }

    // Define a bean for password encryption using BCrypt algorithm
    // This will be used to encode passwords and check password matches securely
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
