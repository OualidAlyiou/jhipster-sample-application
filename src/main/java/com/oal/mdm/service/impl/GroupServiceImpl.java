package com.oal.mdm.service.impl;

import com.oal.mdm.domain.Group;
import com.oal.mdm.repository.GroupRepository;
import com.oal.mdm.service.GroupService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Group}.
 */
@Service
@Transactional
public class GroupServiceImpl implements GroupService {

  private final Logger log = LoggerFactory.getLogger(GroupServiceImpl.class);

  private final GroupRepository groupRepository;

  public GroupServiceImpl(GroupRepository groupRepository) {
    this.groupRepository = groupRepository;
  }

  @Override
  public Group save(Group group) {
    log.debug("Request to save Group : {}", group);
    return groupRepository.save(group);
  }

  @Override
  public Optional<Group> partialUpdate(Group group) {
    log.debug("Request to partially update Group : {}", group);

    return groupRepository
      .findById(group.getId())
      .map(existingGroup -> {
        if (group.getName() != null) {
          existingGroup.setName(group.getName());
        }
        if (group.getIsDefault() != null) {
          existingGroup.setIsDefault(group.getIsDefault());
        }

        return existingGroup;
      })
      .map(groupRepository::save);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<Group> findAll(Pageable pageable) {
    log.debug("Request to get all Groups");
    return groupRepository.findAll(pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<Group> findOne(Long id) {
    log.debug("Request to get Group : {}", id);
    return groupRepository.findById(id);
  }

  @Override
  public void delete(Long id) {
    log.debug("Request to delete Group : {}", id);
    groupRepository.deleteById(id);
  }
}
