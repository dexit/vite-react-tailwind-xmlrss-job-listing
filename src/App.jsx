import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import React from 'react'
function MyComponent() {
  const [vacancies, setVacancies] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedVacancy, setSelectedVacancy] = React.useState(null);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = React.useState(false);
  const [searchCity, setSearchCity] = React.useState('');
  const [channelFilter, setChannelFilter] = React.useState('All');
  const channel1Label = 'Staff Vacancies';
  const channel2Label = 'External Vacancies';

  const fetchAndUpdateVacancies = (url, sourceLabel) => {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        const cleanData = data.replace(/<\/?rss[^>]*>/g, '')
                              .replace(/<channel>/g, '<div>')
                              .replace(/<\/channel>/g, '</div>');
        return parseXML(cleanData, sourceLabel);
      })
      .then(parsedData => {
        setVacancies(prevVacancies => [...prevVacancies, ...parsedData]);
      })
      .catch(error => console.error('Error fetching data: ', error));
  };

  const parseXML = (xmlString, source) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const items = xmlDoc.getElementsByTagName('item');
      return Array.from(items).map(item => {
        const vacancy = { source };
        Array.from(item.children).forEach(child => {
          vacancy[child.tagName.toLowerCase()] = child.textContent;
        });
        return vacancy;
      });
  };

  React.useEffect(() => {
    fetchAndUpdateVacancies('https://sortmycors.rihards-man-private.workers.dev/corsproxy/?channel=1', 'Channel1');
    fetchAndUpdateVacancies('https://sortmycors.rihards-man-private.workers.dev/corsproxy/?channel=2', 'Channel2');
  }, []);

  const handleDetailsClick = vacancy => {
    setSelectedVacancy(vacancy);
    setIsDetailsPopupOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsPopupOpen(false);
  };

  const filteredVacancies = vacancies.filter(vacancy => {
    return (
      vacancy.jobtitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
      vacancy.city.includes(searchCity) &&
      (channelFilter === 'All' || vacancy.source === channelFilter)
    );
  });

  const cities = [...new Set(vacancies.map(vacancy => vacancy.city))];
  const channels = [
    { value: 'All', label: 'All Vacancies' },
    { value: 'Channel1', label: channel1Label },
    { value: 'Channel2', label: channel2Label }
  ];

  const renderVacancyDetails = vacancy => {
    return Object.entries(vacancy).map(([key, value], index) => (
      <div data-part={key} key={index} className="align-left flex flex-wrap mb-2">
        <div className="text-left text-sm pl-2" data-part={key}>
          <span className="text-sm text-left font-bold">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2')}: 
          </span>
        </div>
   {key === 'joburl' ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm hover:underline pl-2"
          >
            Click to Apply!
          </a>
        ) : key === 'link' ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm hover:underline pl-2"
          >
            Source Job Post
          </a>
        ) : key === 'source' && value ==='Channel1' ? (
            
            <p className='text-left text-sm pl-2'>Staff Vacancies</p>
  
        ) : key === 'source' && value ==='Channel2' ? (
            
          <p className='text-left text-sm pl-2'>External Vacancies</p>

      ) : key === 'vacancydescription' ? (
          <div className="text-left text-sm pl-2" data-part={key} dangerouslySetInnerHTML={{ __html: value }}></div>
        ) : key === 'description' ? (
          <div className="text-left text-sm pl-2" data-part={key} dangerouslySetInnerHTML={{ __html: value }}></div>
        ) : key === 'link' ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline pl-2">
            Source Job Post
          </a>
        ) : (
          <span className="text-left text-sm pl-2" data-part={key}>{value}</span>
        )}
      </div>
    ));
  };

  return (
    <React.Fragment>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          className="flex-1 block px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 rounded-lg transition-height duration-500 ease-in-out"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className="rounded-lg transition-height duration-500 ease-in-out block px-3 py-2 bg-white border shadow-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500"
          value={searchCity}
          onChange={e => setSearchCity(e.target.value)}
        >
          <option value="">Filter by city</option>
          {cities.map((city, i) => (
            <option key={i} value={city}>{city}</option>
          ))}
        </select>
        <select
          className="rounded-lg transition-height duration-500 ease-in-out block px-3 py-2 bg-white border shadow-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500"
          value={channelFilter}
          onChange={e => setChannelFilter(e.target.value)}
        >
          {channels.map((channel, i) => (
            <option key={i} value={channel.value}>{channel.label}</option>
          ))}
        </select>
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 rounded-lg transition-height duration-500 ease-in-out">
        {filteredVacancies.length > 0 ? (
          filteredVacancies.map((vacancy, index) => (
            <React.Suspense key={index} fallback={<div>Loading...</div>}>
              <div
                data-part="vacancy"
                id={vacancy.reference}
                data-jobref={vacancy.reference}
                                className="card group flex vacancy flex-wrap w-full justify-between bg-white p-4 hover:shadow-lg hover:bg-slate-100 hover:cursor-pointer  border border-gray-200 hover:border-slate-300 rounded-lg transition-height duration-500 ease-in-out"
>
                <div className="w-full group-hover:text-gray-400 dflex text-sm text-left text-gray-400">
                  Ref: {vacancy.reference}
                </div>
                <h2 className="w-full group-hover:text-gray-700 text-xl font-semibold mb-2">
                  {vacancy.jobtitle}
                </h2>
                <div className="text-sm text-gray-400 group-hover:text-gray-400">
                  {vacancy.city}, {vacancy.location}
                </div>
                <p className="text-sm mb-2 text-gray-500 group-hover:text-gray-500">
                  {vacancy.vacancydescription.split(' ').slice(0, 25).join(' ')}{' '}
                  {vacancy.vacancydescription.length > 25 ? '...' : ''}
                </p>
                {vacancy.source === 'Channel1' ? (
                  <div className="text-sm text-gray-400 group-hover:text-gray-400">
                    Closing: {vacancy.closingdate}
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-gray-400 group-hover:text-gray-400">
                      City: {vacancy.city}, {vacancy.location}
                    </div>
                    <div className="text-sm mb-2 text-gray-400 group-hover:text-gray-500">
                      Salary: {vacancy.salaryrange}
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-gray-400">
                      Experience: {vacancy.experience}
                    </div>
                  </>
                )}
                <button
                  className="mt-2 text-green-500 hover:underline py-2 group-hover:text-green-500 hover:underline-offset-4 transition-all"
                  onClick={() => handleDetailsClick(vacancy)}
                >
                  More Details
                </button>
              </div>
            </React.Suspense>
          ))
        ) : (
          <p>No vacancies found.</p>
        )}

      <div className="flex w-full text-gray-500 p-3"> Results shown : {filteredVacancies.length} </div>

      </div>
      {isDetailsPopupOpen && selectedVacancy && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full transition-opacity duration-300 ease-in-out"
          onClick={handleCloseDetails}
        >
          <div
            className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white transition-transform duration-300 ease-in-out"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex absolute right-0 text-right items-right px-4 py-3">
              <button
                className="top-0 right-0 px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-300"
                onClick={handleCloseDetails}
              >
                Close
              </button>
            </div>
            <div className="mt-3 text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedVacancy.jobtitle}</h3>
              <div className="mt-2 px-2 py-3 vacanypopup" data-part="popupVacancy">
                {renderVacancyDetails(selectedVacancy)}
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
export default MyComponent
