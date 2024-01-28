import React, { useState } from 'react';

const renderFolder = (folder, level = 0, openFolders, setOpenFolders, currentPath = '', apiUrl, keyPrefix = '') => {
    const isOpen = openFolders.includes(folder.name);

    const toggleFolder = () => {
      if (isOpen) {
        setOpenFolders(prev => prev.filter(name => name !== folder.name));
      } else {
        setOpenFolders(prev => [...prev, folder.name]);
      }
    };

    // Ajout du chemin actuel au chemin courant pour construire l'URL
    const newPath = `${currentPath}/${folder.name}`;

    return (
      <div key={keyPrefix + folder.name}>
          <div onClick={toggleFolder} style={{ marginLeft: `${level * 20}px`, cursor: 'pointer' }}>
          {folder.type === 'directory' ? (
              <>
              {isOpen ? '[-]' : '[+]'} {folder.name}
              </>
          ) : (
              <a href={`${folder.link}`} target='_blank' rel="noreferrer"> {folder.name} </a>
          )}
          </div>
        {isOpen &&
          folder.children &&
          folder.children.map((subFolder, index) =>
            renderFolder(subFolder, level + 1, openFolders, setOpenFolders, newPath, apiUrl, keyPrefix + folder.name + '-')
          )}
      </div>
    );
};

const FolderStructure = ({ folderStruct }) => {
  const [openFolders, setOpenFolders] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;

  return (
      <div className='dossier'>
          <h3>Structure du Dossier</h3>
          <div className='folder'>
              {renderFolder(folderStruct, 0, openFolders, setOpenFolders, '', `${apiUrl}`)}
          </div>
      </div>
  );
};

export default FolderStructure;


