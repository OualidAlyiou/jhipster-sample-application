package com.oal.mdm.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Group.
 */
@Entity
@Table(name = "jhi_group")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Group implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "sequenceGenerator"
  )
  @SequenceGenerator(name = "sequenceGenerator")
  @Column(name = "id")
  private Long id;

  @Column(name = "name", unique = true)
  private String name;

  @Column(name = "is_default")
  private Boolean isDefault;

  @ManyToOne
  private User internalUser;

  // jhipster-needle-entity-add-field - JHipster will add fields here

  public Long getId() {
    return this.id;
  }

  public Group id(Long id) {
    this.setId(id);
    return this;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return this.name;
  }

  public Group name(String name) {
    this.setName(name);
    return this;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Boolean getIsDefault() {
    return this.isDefault;
  }

  public Group isDefault(Boolean isDefault) {
    this.setIsDefault(isDefault);
    return this;
  }

  public void setIsDefault(Boolean isDefault) {
    this.isDefault = isDefault;
  }

  public User getInternalUser() {
    return this.internalUser;
  }

  public void setInternalUser(User user) {
    this.internalUser = user;
  }

  public Group internalUser(User user) {
    this.setInternalUser(user);
    return this;
  }

  // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof Group)) {
      return false;
    }
    return id != null && id.equals(((Group) o).id);
  }

  @Override
  public int hashCode() {
    // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
    return getClass().hashCode();
  }

  // prettier-ignore
    @Override
    public String toString() {
        return "Group{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", isDefault='" + getIsDefault() + "'" +
            "}";
    }
}
