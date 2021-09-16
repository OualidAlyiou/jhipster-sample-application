package com.oal.mdm.repository;

import com.oal.mdm.domain.Group;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Group entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
  @Query(
    "select jhiGroup from Group jhiGroup where jhiGroup.internalUser.login = ?#{principal.username}"
  )
  List<Group> findByInternalUserIsCurrentUser();
}
