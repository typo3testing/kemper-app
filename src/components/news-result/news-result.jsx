import React from "react";
import cx from "classnames";
import { Redirect } from "react-router";
import styles from "./news-result.css";
import globalStyles from "../../../css/global.css";

import { ApiService } from "../../services/ApiService";
const apiService = new ApiService();

export default class NewsResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [],
      dataReady: true,
      dataDetails: false,
      contentDetails: []
    };
    this.loadDetails = this.loadDetails.bind(this);
    this.loadNews = this.loadNews.bind(this);
  }
  loadNews() {
    this.setState({ dataDetails: false });
  }
  loadDetails(data) {
    this.setState({ contentDetails: data });
    this.setState({ dataDetails: true });
  }
  componentDidMount() {
    if (sessionStorage.getItem("initialNewsList") == null) {
      apiService
        .getNews()
        .then(data => {
          sessionStorage.setItem(
            "initialNewsList",
            JSON.stringify(data.content)
          );
          this.setState({ content: data.content });
          this.setState({ dataReady: false });
          //  console.log(data.content);
        })
        .catch(error => console.log(error));
    } else {
      let initialNews = JSON.parse(sessionStorage.getItem("initialNewsList"));
      this.setState({
        content: initialNews
      });
      this.setState({ dataReady: false });
    }
  }

  render() {
    let contentTemplate = this.state.content.map(v => (
      <div
        className={cx(globalStyles.NewsListRow)}
        key={v.uid}
        onClick={() => this.loadDetails(v)}
      >
        <h6 className={cx(globalStyles.NewsExcerptHead)}>{v.title}</h6>
        <p>{v.dtstart}</p>
      </div>
    ));
    if (this.state.dataDetails) {
      return (
        <div className={cx(globalStyles.NewsDetailModule)}>
          <div
            onClick={this.loadNews}
            className={cx(
              globalStyles.PageButton,
              globalStyles.PrimaryColorButton,
              globalStyles.PageBackButton
            )}
          >
            Zurück
          </div>
          <br />
          <br />
          <h5>{this.state.contentDetails.title}</h5>
          <p>
            <em>{this.state.contentDetails.dtstart}</em>
          </p>
          <div
            dangerouslySetInnerHTML={{
              __html: this.state.contentDetails.details
            }}
          />
          <br />
          <br />
          <div
            onClick={this.loadNews}
            className={cx(
              globalStyles.PageButton,
              globalStyles.PrimaryColorButton,
              globalStyles.PageBackButton
            )}
          >
            Zurück
          </div>
        </div>
      );
    }
    if (this.state.dataReady) {
      return (
        <div
          className={cx(
            globalStyles.CustomLoading,
            globalStyles.PullTextCenter
          )}
        >
          <div className={cx(globalStyles.Tablewrap)}>
            <div
              className={cx(
                globalStyles.Tablecell,
                globalStyles.Tablemiddleline
              )}
            >
              Wird geladen...
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={cx(globalStyles.NewsListModule)}>{contentTemplate}</div>
    );
  }
}
