import { useEffect, useState } from "react";
import { TVShowAPi } from "./api/tv-show";
import s from "./style.module.css";
import { BACKDROP_BASE_URL } from "./config";
import { TVShowDetail } from "./components/TVShowDetail/TVShowDetail";
import { Logo } from "./components/Logo/Logo";
import logoImg from "./assests/images/logo.png";
//import { TVShowListItem } from "./components/TVShowListItem/TVShowListItem";
import { TVShowList } from "./components/TVShowList/TVShowList";
import { SearchBar } from "./components/SearchBar/SearchBar";
export function App() {
  const [currentTVShow, setCurrentTVShow] = useState();
  const [recommendationList, setRecommendationList] = useState([]);

  async function fetchPopulars() {
    try {
      const popularTVShowList = await TVShowAPi.fetchPopulars();
      if (popularTVShowList.length > 0) {
        setCurrentTVShow(popularTVShowList[0]);
      }
    } catch (error) {
      alert("Something went wrong while fetching popular tv show");
    }
  }
  async function fetchRecommendations(tvShowId) {
    try {
      const recommendationListResp = await TVShowAPi.fetchRecommendations(
        tvShowId
      );

      if (recommendationListResp.length > 0) {
        setRecommendationList(recommendationListResp.slice(0, 10));
      }
    } catch (error) {
      alert("Something went wrong while fetching recommendation list");
    }
  }
  useEffect(() => {
    fetchPopulars();
  }, []);

  useEffect(() => {
    if (currentTVShow) {
      fetchRecommendations(currentTVShow.id);
    }
  }, [currentTVShow]);
  // console.log(recommendationList);
  //console.log(currentTVShow);

  function updateCurrentTVShow(tvShow) {
    setCurrentTVShow(tvShow);
  }

  async function fetchByTitle(title) {
    try {
      const searchResponse = await TVShowAPi.fetchByTitle(title);
      if (searchResponse.length > 0) {
        setCurrentTVShow(searchResponse[0]);
        // console.log(currentTVShow);
      }
    } catch (error) {
      alert("Something went wrong while fetching by title");
    }
  }
  return (
    <div
      className={s.main_container}
      style={{
        background: currentTVShow
          ? `linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url("${BACKDROP_BASE_URL}${currentTVShow.backdrop_path}") no-repeat center /cover`
          : "black",
      }}
    >
      <div className={s.header}>
        <div className="row">
          <div className="col-4">
            <Logo
              img={logoImg}
              title="Watowatch"
              subtitle="Find a show you may like"
            />
          </div>
          <div className="col-md-4 col-lg-4">
            <SearchBar onSubmit={fetchByTitle} />
            {/* <input style={{ width: "100%" }} type="text" /> */}
          </div>
        </div>
      </div>
      <div className={s.tv_show_detail}>
        {currentTVShow && <TVShowDetail tvShow={currentTVShow} />}
      </div>
      <div className={s.recommended_tv_shows}>
        {
          currentTVShow && (
            <TVShowList
              onClickItem={updateCurrentTVShow}
              tvShowList={recommendationList}
            />
          )
          // <>
          //   <TVShowListItem
          //     tvShow={currentTVShow}
          //     onClick={(tvShow) => {
          //       console.log("I am Clicked", tvShow);
          //     }}
          //   />
          //   <TVShowListItem
          //     tvShow={currentTVShow}
          //     onClick={(tvShow) => {
          //       console.log("I am Clicked", tvShow);
          //     }}
          //   />
          //   <TVShowListItem
          //     tvShow={currentTVShow}
          //     onClick={(tvShow) => {
          //       console.log("I am Clicked", tvShow);
          //     }}
          //   />
          // </>
        }
      </div>
    </div>
  );
}
