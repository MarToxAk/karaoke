import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Page() {
  const [posts, setPosts]: any = useState([]);
  const [search, setSearch]: any = useState('');
  const [loading, setLoading]: any = useState(true);
  const [currentPage, setCurrentPage]: any = useState(1);
  const [postsPerPage, setPostsPerPage]: any = useState(10); // Altere este valor para o número de posts que você quer por página
  const [filteredPosts, setFilteredPosts]: any = useState([]);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(true); // true para crescente, false para decrescente
  const [showModal, setShowModal] = useState(false);
  const [currentPostId, setCurrentPostId]: any = useState([]);
  const [currentLink, setCurrentLink]: any = useState(null);


  const sortPosts = (column: any) => {
    const newDirection = column === sortColumn ? !sortDirection : true;
    setSortColumn(column);
    setSortDirection(newDirection);

    setFilteredPosts(filteredPosts.sort((a: any, b: any) => {

      if (a[column] < b[column]) return newDirection ? -1 : 1;
      if (a[column] > b[column]) return newDirection ? 1 : -1;
      return 0;
    }));
  };

  const openModal = async (postId: any) => {
    try {
      // Substitua 'artista' e 'faixa' pelos valores apropriados
      const response = await fetch(`/api/deezer/search?q=artist:"${postId.Artista}"%20track:"${postId.Titulo}"`, {
        method: 'GET', // Método HTTP
        headers: {
          'Accept': 'application/json', // Informa ao servidor que o cliente espera JSON
        }
      });
      if (response) {

        const data = await response.json();
        setCurrentLink(data.data[0].link.replace('www.deezer.com/track', 'widget.deezer.com/widget/auto/track'));
        setCurrentPostId(postId);
        setShowModal(true);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }


  const closeModal = () => {
    setShowModal(false);
  };

  const getPages = () => {
    const pages = []
    const halfDisplayedPages = Math.floor(5 / 2)

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (currentPage >= i - halfDisplayedPages && currentPage <= i + halfDisplayedPages)
      ) {
        pages.push(i)
      }
    }

    return pages
  }

  function removeAccents(str: any) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const response = await fetch('/api/listmusic')
        if (response) {
          const data = await response.json()
          setPosts(data.musicList)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    }

    fetchDataFromApi(); // Chame a função aqui
  }, []); // Adicione um array vazio como segundo argumento para evitar chamadas repetidas



  useEffect(() => {

    const searchWithoutAccents = removeAccents(search.toLowerCase());
    const filtered = posts.filter((post: { codigo: string; Titulo: string; Artista: string; }) =>
      removeAccents(post.codigo.toLowerCase()).includes(searchWithoutAccents) ||
      removeAccents(post.Titulo.toLowerCase()).includes(searchWithoutAccents) ||
      removeAccents(post.Artista.toLowerCase()).includes(searchWithoutAccents)
    );

    setFilteredPosts(filtered.sort((a: any, b: any) => {
      if (a['Titulo'] < b['Titulo']) return -1;
      return 0;
    }));
    if (filtered.length < posts.length / 60) {
      setPostsPerPage(filtered.length);
    }
    else {
      // Altura da linha (ajuste conforme necessário)
      const rowHeight = 50;
      // Altura disponível (ajuste conforme necessário)
      const availableHeight = window.innerHeight - 200;
      // Calcular o número de linhas
      const numberOfRows = Math.floor(availableHeight / rowHeight);
      // Atualizar o estado
      setPostsPerPage(numberOfRows)
    }

    setCurrentPage(1);
  }, [posts, search]);

  useEffect(() => {
    const handleResize = () => {
      // Altura da linha (ajuste conforme necessário)
      const rowHeight = 50;
      // Altura disponível (ajuste conforme necessário)
      const availableHeight = window.innerHeight - 200;
      // Calcular o número de linhas
      const numberOfRows = Math.floor(availableHeight / rowHeight);
      // Atualizar o estado
      setPostsPerPage(numberOfRows)
    };

    // Lidar com o redimensionamento da janela
    window.addEventListener('resize', handleResize);
    handleResize();

    // Limpar o evento ao desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Obter posts atuais
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Mudar página
  const paginate: any = (pageNumber: number) => setCurrentPage(pageNumber);



  return (

    <div className="container" style={{ backgroundColor: 'lightgray', color: 'black' }}>
      <main>

        <header className="fixed-top" style={{ backgroundColor: 'black', textAlign: 'center', padding: '10px' }}>
          <img src="/icons/icon.svg" width="80" height="" alt="Descrição da imagem" />
          <h6 style={{ color: 'white', fontSize: '10px' }}>{posts.length}</h6>
        </header>

        <div style={{ paddingTop: '90px' }} className="sticky-top">
          <input type="text" className="form-control " value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." />
        </div>

        <div style={{ paddingTop: '10px', paddingBottom: '70px' }} className="container" >

          {loading ? (
            <div className="table-responsive">
              <table className="table table-dark">
                <thead>
                  <tr>
                    <th className="placeholder-glow">
                      <span className="placeholder col-6"></span>
                    </th>
                    <th className="placeholder-glow">
                      <span className="placeholder col-6"></span>
                    </th>
                    <th className="placeholder-glow">
                      <span className="placeholder col-6"></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array(postsPerPage).fill(0).map((_, index) => (
                    <tr key={index}>
                      <td className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </td>
                      <td className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </td>
                      <td className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <nav>
                <div className='d-flex justify-content-center'>
                  <ul className="pagination mx-auto">
                    <li className="page-item ">
                      <a className="page-link" onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}>
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>
                    {getPages().map((page: number, index: number) => (
                      <li key={index} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                        <a className="page-link" onClick={() => setCurrentPage(page)}>{page}</a>
                      </li>
                    ))}
                    <a className="page-link">?</a>

                    <li className="page-item">
                      <a className="page-link" onClick={() => setCurrentPage(currentPage < Math.ceil(filteredPosts.length / postsPerPage) ? currentPage + 1 : currentPage)}>
                        <span aria-hidden="true">&raquo;</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          ) : (
            <div className=" table-responsive">
              <table className="table bootstrap-table" style={{ backgroundColor: 'gray', color: 'black', border: '1px solid black' }}>
                <thead style={{ backgroundColor: 'black', color: 'white' }}>
                  <tr>
                    <th data-sortable="true" onClick={() => sortPosts('codigo')}>codigo</th>
                    <th data-sortable="true" onClick={() => sortPosts('Titulo')}>Titulo</th>
                    <th data-sortable="true" onClick={() => sortPosts('Artista')}>Artista</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPosts.map((post: { ID: string, codigo: string; Titulo: string; Artista: string; }) => (
                    <tr key={post.ID} onClick={() => openModal({ codigo: post.codigo, Titulo: post.Titulo, Artista: post.Artista })}>
                      <td>{post.codigo}</td>
                      <td className="text-truncate" style={{ maxWidth: '150px' }} title={post.Titulo}>{post.Titulo}</td>
                      <td className="text-truncate" style={{ maxWidth: '150px' }} title={post.Artista}>{post.Artista}</td>
                    </tr>
                  ))}
                </tbody>
                <Modal show={showModal} onHide={closeModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>{currentPostId.codigo} - {currentPostId.Titulo} - {currentPostId.Artista}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div style={{ width: '100%', height: '100%', backgroundColor: 'lightgray' }}>
                      <iframe title="deezer-widget" src={currentLink} width="100%" height="150" frameBorder="0" allow="encrypted-media; clipboard-write"></iframe>
                    </div>
                  </Modal.Body>
                </Modal>
              </table>
              <nav>
                <div className='d-flex justify-content-center'>
                  <ul className="pagination mx-auto">
                    <li className="page-item ">
                      <a className="page-link" onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}>
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>
                    {getPages().map((page: number, index: number) => (
                      <li key={index} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                        <a className="page-link" onClick={() => setCurrentPage(page)}>{page}</a>
                      </li>
                    ))}
                    <li className="page-item">
                      <a className="page-link" onClick={() => setCurrentPage(currentPage < Math.ceil(filteredPosts.length / postsPerPage) ? currentPage + 1 : currentPage)}>
                        <span aria-hidden="true">&raquo;</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>

            </div>
          )}
        </div>
        <footer className="fixed-bottom bg-dark text-white py-3">
          <Container>
            <Row>
              <Col xs={6}>
                <a href="https://www.instagram.com/k.rezende59?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-white">
                  <FaInstagram size={24} />
                </a>
                <a href="https://wa.me/+5512974067360" target="_blank" rel="noopener noreferrer" className="text-white ml-2">
                  <FaWhatsapp size={24} />
                </a>
              </Col>
              <Col xs={6} className="text-end">
                2024©AutoPyWeb
              </Col>
            </Row>
          </Container>
        </footer>
      </main>

      <style jsx>{`
        .page-item.active .page-link {
          background-color: black;
          border-color: black;
          color: white;
        }
        .page-link {
          color: black;
        }
        .page-link:hover {
          color: white;
          background-color: black;
          border-color: black;
        }
      `}</style>
    </div>
  );
}