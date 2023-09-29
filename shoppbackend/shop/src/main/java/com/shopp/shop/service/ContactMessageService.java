package com.shopp.shop.service;

import com.shopp.shop.model.ContactMessage;
import com.shopp.shop.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class ContactMessageService {
    @Autowired
    private ContactMessageRepository contactMessageRepository;

    public ContactMessage saveMessage(ContactMessage contactMessage){
        return contactMessageRepository.save(contactMessage);
    }

    public List<ContactMessage> allMessages(){
        return contactMessageRepository.findAll();
    }
    public void deleteMessage (Long contactId){
        ContactMessage idContact = contactMessageRepository.findById(contactId)
                .orElseThrow(() -> new IllegalArgumentException(String.valueOf(contactId) + "not found"));
        contactMessageRepository.delete(idContact);
    }
}
