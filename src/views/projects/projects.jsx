import React from "react";
import cx from "classnames";

import { translate } from "../../services";

import Button from "../../components/button/button";
import Toggle from "../../components/toggle/toggle";
import HeaderBar from "../../components/header-bar/header-bar";
import DetailContainer from "../../components/detail-container/detail-container.js";
import DetailHeader from "../../components/detail-header/detail-header.js";
import DetailContent from "../../components/detail-content/detail-content.js";

import styles from "./projects.css";
import viewStyles from "../views.css";
import globalStyles from "../../../css/global.css";

export default ({
  projects,
  type,
  toggleType,
  goBack,
  deleteProject,
  uploadProject,
  downloadProject,
  loadProject,
  user,
  getProjectImage,
  cloudProjectsEnabled
}) => (
  <div
    className={cx(
      styles.Container,
      globalStyles.Background,
      globalStyles.BackgroundImage,
      globalStyles.BackgroundColor,
      !cloudProjectsEnabled && styles.noCloudToggle
    )}
  >
    <HeaderBar goBack dark />
    {type === "cloud" && user && (
      <div className={styles.UserName}>
        {translate("ProjectsUser")}: {user}
      </div>
    )}
    {cloudProjectsEnabled && (
      <Toggle
        className={styles.CloudToggle}
        icon1="local"
        icon2="cloud"
        onClick={toggleType}
      />
    )}
    <div className={styles.Projects}>
      {!projects[type].length && (
        <div className={styles.Empty}>{translate("ProjectsEmpty")}</div>
      )}
      {projects[type].map((project, index) => (
        <div key={index} className={cx(styles.ProjectContainer)}>
          <div className={styles.Project}>
            <DetailContainer>
              <DetailHeader className={styles.ProjectHeader}>
                {project.name}
              </DetailHeader>
              <DetailContent className={styles.ProjectBody}>
                <div
                  onClick={() => loadProject(project)}
                  className={styles.ProjectImage}
                  style={{
                    backgroundImage: `url('${getProjectImage(project)}')`
                  }}
                />
                <div className={styles.ProjectButtons}>
                  <Button
                    onClick={() => loadProject(project)}
                    className={styles.ProjectButton}
                    icon="open"
                    size="medium"
                    dark
                  />
                  <Button
                    onClick={() => deleteProject(project)}
                    className={styles.ProjectButton}
                    icon="delete"
                    size="medium"
                    dark
                  />
                  {type !== "local" && cloudProjectsEnabled && (
                    <Button
                      onClick={() => downloadProject(project)}
                      className={styles.ProjectButton}
                      icon="local"
                      size="medium"
                      dark
                    />
                  )}
                  {type !== "cloud" && cloudProjectsEnabled && (
                    <Button
                      onClick={() => uploadProject(project)}
                      className={styles.ProjectButton}
                      icon="upload"
                      size="medium"
                      dark
                    />
                  )}
                </div>
              </DetailContent>
            </DetailContainer>
          </div>
        </div>
      ))}
    </div>
  </div>
);
