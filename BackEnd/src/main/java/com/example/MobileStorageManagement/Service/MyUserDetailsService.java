package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.Entity.User;
import com.example.MobileStorageManagement.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String input)
            throws UsernameNotFoundException {

        User user;

        if (input.contains("@")) {
            user = userRepository.findByEmail(input)
                    .orElseThrow(() ->
                            new UsernameNotFoundException(
                                    "Không tìm thấy user với email: " + input
                            )
                    );
        } else {
            user = userRepository.findBySdt(input)
                    .orElseThrow(() ->
                            new UsernameNotFoundException(
                                    "Không tìm thấy user với SDT: " + input
                            )
                    );
        }

        String roleName = user.getRole().getRoleName().toUpperCase();

        return new org.springframework.security.core.userdetails.User(
                input, // username (email hoặc sdt đều OK)
                user.getPassword() == null ? "" : user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + roleName))
        );
    }
}
