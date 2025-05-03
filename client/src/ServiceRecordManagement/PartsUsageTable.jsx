import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import './PartsUsageTable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';  

function PartsUsageTable() {
  const [partsUsage, setPartsUsage] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    axios
      .get("http://localhost:3001/Services")
      .then((result) => {
        const services = result.data;
        const partsCount = {};

        services.forEach((service) => {
          const parts = service.parts.split(", ");
          const serviceDate = service.date;
          const quantity = service.quantity;

          parts.forEach((part) => {
            if (!partsCount[part]) {
              partsCount[part] = { dates: [] };
            }
            partsCount[part].dates.push({ date: serviceDate, quantity });
          });
        });

        const partsUsageArray = Object.keys(partsCount).map((part) => ({
          part,
          dates: partsCount[part].dates
        }));

        setPartsUsage(partsUsageArray);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredPartsUsage = partsUsage.filter((part) => {
    return part.dates.some(d => {
      const date = new Date(d.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return (!startDate || date >= start) && (!endDate || date <= end);
    });
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.text("Most Commonly Used Parts", 14, 16);
    doc.autoTable({
      head: [['Part Name', 'Date & Quantity']],
      body: filteredPartsUsage.map((part) => [
        part.part,
        part.dates.map(d => `${d.date}: ${d.quantity}`).join("\n")
      ]),
      startY: 20,
      styles: { fontSize: 10 },
    });

    doc.save("parts-usage-report.pdf");
  };

  const formatEmailBody = () => {
    const emailBody = `
      Most Commonly Used Parts:\n\n
      ${filteredPartsUsage.map(part => {
        return `${part.part}:\n${part.dates.map(d => `${d.date}: ${d.quantity}`).join('\n')}\n`;
      }).join('\n')}
    `;
    return encodeURIComponent(emailBody);
  };

  const sendEmail = () => {
    const subject = encodeURIComponent("Parts Usage Report");
    const body = formatEmailBody();
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  const handleOutsideClick = (event) => {
    if (event.target.closest('.dropdown-menu') === null) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [dropdownOpen]);

  return (
    <div className="parts-usage-container" style={{marginTop:'20px', marginBottom:'20px'}}>
      <h2 className="parts-usage-header">
        Most Commonly Used Parts
      </h2>

      <div className="date-picker-container">
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          placeholder="Start Date" 
        />
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          placeholder="End Date" 
        />
      </div>

      <div className="parts-usage-table">
        <table>
          <thead>
            <tr>
              <th>Part Name</th>
              <th>Date & Quantity</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartsUsage.map((part, index) => (
              <tr key={index}>
                <td className="part-name">{part.part}</td>
                <td className="date-quantity">
                  <ul className="date-quantity-list">
                    {part.dates.map((d, i) => (
                      <li key={i}>
                        <strong>{d.date}:</strong> {d.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="download-button" onClick={downloadPDF}>
        Download as PDF
      </button>
      <button className="email-button" onClick={sendEmail}>
        Send the Details
      </button>
    </div>
  );
}

export default PartsUsageTable;
