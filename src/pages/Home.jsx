import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const imagePlaceholder = "https://via.placeholder.com/240x150";

const Home = () => {
  const [sourceList, setSourceList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [isLoadingSourceList, setIsLoadingSourceList] = useState(false);
  const [isLoadingNewsList, setIsLoadingNewsList] = useState(false);
  const [selectedSource, setSelectedSource] = useState();
  const [selectedType, setSelectedType] = useState();

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  useEffect(() => {
    const getSourceList = async () => {
      setIsLoadingSourceList(true);
      fetch("https://berita-indo-api.vercel.app/")
        .then((response) => response.json())
        .then((data) => {
          setSourceList(data.listApi);
          setSelectedSource(Object.keys(data.listApi)[0]);
          setIsLoadingSourceList(false);
        });
    };
    getSourceList();
  }, []);

  const selectedNewsDetail = useMemo(
    () => selectedSource && sourceList[selectedSource],
    [selectedSource, sourceList]
  );

  useEffect(() => {
    if (selectedNewsDetail) {
      const getAllNews = async () => {
        setIsLoadingNewsList(true);
        fetch(selectedType ? selectedNewsDetail.all + selectedType : selectedNewsDetail.all)
          .then((response) => response.json())
          .then((data) => {
            setNewsList(data.data);
            setIsLoadingNewsList(false);
          });
      };
      getAllNews();
    }
  }, [selectedNewsDetail, selectedType]);

  const NewsList = () => {
    if (isLoadingNewsList) {
      return <p className='text-center mt-5 text-black'>Loading...</p>;
    }

    return newsList?.length ? (
      <>
        <div class="d-flex flex-wrap py-4 border-bottom mb-4">
          <h2 className="card-title px-3 mb-4" style={{ width: '100%' }}>Featured Artikel</h2>
          <div
            className="card border-0 text-bg-light px-3 bg-transparent"
            style={{ width: "60%", cursor: "pointer" }}
            onClick={() => window.open(newsList[0].link, "_blank")}
          >
            <img src={newsList[0].image?.large || imagePlaceholder} className="card-img-top mb-3" alt="..." />
            <p style={{ fontSize: '12px' }} className='mb-1 text-secondary'>{new Date(newsList[0].isoDate).toLocaleDateString('id-ID', options)}</p>
            <h5 className="card-title">{newsList[0].title}</h5>
            <p className="card-text">
              {newsList[0]?.contentSnippet || newsList[0]?.content}
            </p>
          </div>
          <div class="d-flex flex-wrap" style={{ width: "40%" }}>
            {newsList?.slice(1, 4).map((news, i) => (
              <div
                className="d-flex flex-row align-items-center card border-0 text-bg-light px-3 bg-transparent mb-1"
                style={{ width: "100%", cursor: "pointer" }}
                key={i}
                onClick={() => window.open(news.link, "_blank")}
              >
                <img style={{ width: '50%' }} src={news.image?.small || imagePlaceholder} className="card-img-top mb-2" alt="..." />
                <div>
                  <p style={{ fontSize: '12px' }} className='px-3 mb-1 text-secondary'>{new Date(news.isoDate).toLocaleDateString('id-ID', options)}</p>
                  <h6 className="card-title px-3">{news.title}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div class="d-flex flex-wrap">
          <h2 className="card-title px-3 mb-4" style={{ width: '100%' }}>Artikel Terbaru</h2>
          {newsList?.slice(4).map((news, i) => (
            <div
              className="card border-0 text-bg-light p-3 bg-transparent"
              style={{ width: "25%", cursor: "pointer" }}
              key={i}
              onClick={() => window.open(news.link, "_blank")}
            >
              <img src={news.image?.small || imagePlaceholder} className="card-img-top" alt="..." />
              <div className="card-body">
                <p style={{ fontSize: '12px' }} className='mb-1 text-secondary'>{new Date(news.isoDate).toLocaleDateString('id-ID', options)}</p>
                <h5 className="card-title fw-bold">{news.title}</h5>
                <p className="card-text fs-6">
                  {news?.contentSnippet?.slice(0, 75) || news?.content?.slice(0, 75)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </>
    ) : (
      <div className="text-center">
        <p>Berita Tidak Ditemukan</p>
      </div>
    );
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary">
        <div className="container px-4 py-4">
          <Link className="navbar-brand display-1 text-light" to="/">
            <h3>
              <strong>PORTAL BERITA</strong>
            </h3>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <select
              class="form-select ms-auto me-2"
              style={{ maxWidth: "200px" }}
              onChange={(e) => {
                setSelectedSource(e.target.value);
              }}
              value={selectedSource}
            >
              <option selected value="all">
                Pilih Sumber
              </option>
              {sourceList &&
                Object.keys(sourceList)?.map((key, i) => (
                  <option value={key}>{key}</option>
                ))}
            </select>
          </div>
        </div>
      </nav>

      <div className="container text-secondary py-4">
      {isLoadingSourceList ? <p className='text-center mt-3 text-black'>Loading...</p> : (
        <>
          <div className="px-3">
            {selectedNewsDetail?.listType.map((type) => (
              <span
                className={`me-2 badge rounded-pill text-bg-${selectedType === type ? 'warning' : 'light'}`}
                onClick={() => setSelectedType(type)}
                style={{
                  cursor: "pointer",
                }}
              >
                {type.toUpperCase()}
              </span>
            ))}
          </div>
          <NewsList />
        </>
      )}
      </div>
    </>
  );
};

export default Home;
