import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10); // Altere este valor para o número de posts que você quer por página
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const response = await fetch('/api/listmusic')
        if (response) {
          const data = await response.json()
          console.log(data.musicList)
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
    setFilteredPosts(
      posts.filter(post =>
        post.ID.toLowerCase().includes(search.toLowerCase()) ||
        post.Titulo.toLowerCase().includes(search.toLowerCase()) ||
        post.Artista.toLowerCase().includes(search.toLowerCase()) ||
        setCurrentPage(1)
      )
    );
  }, [search, posts]);

  useEffect(() => {
    const handleResize = () => {
      // Altura da linha (ajuste conforme necessário)
      const rowHeight = 40;
      // Altura disponível (ajuste conforme necessário)
      const availableHeight = window.innerHeight - 200;
      // Calcular o número de linhas
      const numberOfRows = Math.floor(availableHeight / rowHeight);
      // Atualizar o estado
      console.log(numberOfRows)
      setPostsPerPage(numberOfRows);
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
  const paginate = pageNumber => setCurrentPage(pageNumber);



  return (
    <div className="container" style={{ backgroundColor: 'lightgray', color: 'black' }}>
      <header style={{ backgroundColor: 'black', textAlign: 'center', padding: '10px' }}>
        <img src="/icons/icon.svg" width="70" height="" alt="Descrição da imagem" />
      </header>
      <input type="text" className="form-control" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." />
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
              {Array(5).fill().map((_, index) => (
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
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table" style={{ backgroundColor: 'gray', color: 'black', border: '1px solid black' }}>
            <thead style={{ backgroundColor: 'black', color: 'white' }}>
              <tr>
                <th>ID</th>
                <th>Titulo</th>
                <th>Artista</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map(post => (
                <tr key={post.ID}>
                  <td>{post.ID}</td>
                  <td className="text-truncate" style={{ maxWidth: '150px' }} title={post.Titulo}>{post.Titulo}</td>
                  <td className="text-truncate" style={{ maxWidth: '150px' }} title={post.Artista}>{post.Artista}</td>
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
                {Array(Math.ceil(filteredPosts.length / postsPerPage)).fill().map((_, index) => (
                  <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                    <a onClick={() => paginate(index + 1)} className="page-link">
                      {index + 1}
                    </a>
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