import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Pages/styles/Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faTemperatureHigh, faGasPump, faBatteryHalf } from '@fortawesome/free-solid-svg-icons';
import ReactSpeedometer from 'react-d3-speedometer';
import GaugeChart from 'react-gauge-chart';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

//const socket = io('http://localhost:3001'); // Adjust to your backend URL

const Dashboard = () => {
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [carName, setCarName] = useState('Unknown');
  const [carModel, setCarModel] = useState('Unknown');
  const [engineTemp, setEngineTemp] = useState(0);
  const [fuelLevel, setFuelLevel] = useState(0);
  const [batteryVoltage, setBatteryVoltage] = useState(0);
  const [ambientTemp, setAmbientTemp] = useState(0);

  useEffect(() => {
    socket.on('obdData', (data) => {
      setSpeed(data.speed);
      setRpm(data.rpm);
      setCarName(data.carName || 'Unknown');
      setCarModel(data.carModel || 'Unknown');
      setEngineTemp(data.engineTemp);
      setFuelLevel(data.fuelLevel);
      setBatteryVoltage(data.batteryVoltage);
      setAmbientTemp(data.ambientTemp);
    });

    return () => socket.off('obdData');
  }, []);

  const generateReport = () => {
    Swal.fire({
      title: 'Generating Report',
      text: 'Please wait while the report is being generated...',
      allowOutsideClick: false,
      didOpen: () => {
        const element = document.getElementById('dashboard');
        html2canvas(element, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'pt', 'a4');
          pdf.addImage(imgData, 'PNG', 0, 0, 595, 842);
          pdf.save('report.png');
          Swal.fire({
            title: 'Report Generated',
            text: 'Your report has been downloaded.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        });
      },
    });
  };

  const getOverallCondition = () => {
    // Logic to determine the overall condition of the vehicle
    // Example: If any value is out of the acceptable range, mark it as bad.
    if (engineTemp > 90 || fuelLevel < 10 || batteryVoltage < 11.5) {
      return 'The vehicle is in bad condition. Please check immediately!';
    }
    return 'The vehicle is in good condition.';
  };

  const showScanningProcess = () => {
    Swal.fire({
      title: 'Scanning...',
      html: `
        <p>Scanning vehicle condition...</p>
        <div id="progress-container" style="width: 100%; background-color: #eee;">
          <div id="progress-bar" style="width: 0; height: 20px; background-color: #4caf50;"></div>
        </div>
        <div id="progress-text" style="margin-top: 10px; text-align: center; font-weight: bold;">0%</div>
      `,
      allowOutsideClick: false,
      didOpen: () => {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        let progress = 0;
        const duration = 5000; // Duration in milliseconds (5 seconds)
        const intervalTime = 50; // Update interval in milliseconds
        const steps = duration / intervalTime;
        const increment = 100 / steps;

        const interval = setInterval(() => {
          progress += increment;
          progressBar.style.width = `${Math.min(progress, 100)}%`;
          progressText.innerText = `${Math.round(progress)}%`;
          if (progress >= 100) {
            clearInterval(interval);
            Swal.fire({
              title: 'Scan Complete',
              text: getOverallCondition(),
              icon: getOverallCondition().includes('good') ? 'success' : 'error',
              confirmButtonText: 'OK',
            });
          }
        }, intervalTime);
      },
    });
  };

  return (
    <div id="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-item car-name">
          <FontAwesomeIcon icon={faCar} size="3x" className="icon" />
          <h2 className="dashboard-title">Car Name</h2>
          <div className="dashboard-value">{carName}</div>
        </div>
        <div className="dashboard-item car-model">
          <FontAwesomeIcon icon={faCar} size="3x" className="icon" />
          <h2 className="dashboard-title">Car Model</h2>
          <div className="dashboard-value">{carModel}</div>
        </div>
        <div className="dashboard-item speed">
          <h2 className="dashboard-title">Speed</h2>
          <ReactSpeedometer
            maxValue={240}
            value={speed}
            needleColor="red"
            startColor="green"
            endColor="red"
            segments={10}
            currentValueText={`${speed} km/h`}
            valueTextFontSize="20px"
            needleTransitionDuration={500}
            needleTransition="easeElastic"
          />
        </div>
        <div className="dashboard-item rpm">
          <h2 className="dashboard-title">RPM</h2>
          <ReactSpeedometer
            maxValue={8000}
            value={rpm}
            needleColor="blue"
            startColor="green"
            endColor="red"
            segments={10}
            currentValueText={`${rpm} RPM`}
            valueTextFontSize="20px"
            needleTransitionDuration={500}
            needleTransition="easeElastic"
          />
        </div>
        <div className="dashboard-item engine-temp">
          <FontAwesomeIcon icon={faTemperatureHigh} size="3x" className="icon" />
          <h2 className="dashboard-title">Engine Temp</h2>
          <div className="dashboard-value">{`${engineTemp} °C`}</div>
        </div>
        <div className="dashboard-item fuel-level">
          <FontAwesomeIcon icon={faGasPump} size="3x" className="icon" />
          <h2 className="dashboard-title">Fuel Level</h2>
          <GaugeChart
            id="fuel-level-gauge"
            nrOfLevels={20}
            percent={fuelLevel / 100}
            needleColor="blue"
            needleBaseColor="blue"
            arcWidth={0.3}
            colors={['#00FF00', '#FFFF00', '#FF0000']}
          />
          <div className="dashboard-value">{`${fuelLevel} %`}</div>
        </div>
        <div className="dashboard-item battery-voltage">
          <FontAwesomeIcon icon={faBatteryHalf} size="3x" className="icon" />
          <h2 className="dashboard-title">Battery Voltage</h2>
          <GaugeChart
            id="battery-voltage-gauge"
            nrOfLevels={10}
            percent={batteryVoltage / 15}
            needleColor="orange"
            needleBaseColor="orange"
            arcWidth={0.3}
            colors={['#00FF00', '#FFFF00', '#FF0000']}
          />
          <div className="dashboard-value">{`${batteryVoltage} V`}</div>
        </div>
        <div className="dashboard-item ambient-temp">
          <FontAwesomeIcon icon={faTemperatureHigh} size="3x" className="icon" />
          <h2 className="dashboard-title">Ambient Temp</h2>
          <div className="dashboard-value">{`${ambientTemp} °C`}</div>
        </div>
      </div>
      <button onClick={generateReport} className="report-button">Generate Report</button>
      <button onClick={showScanningProcess} className="condition-button">Scan Overall Condition</button>
    </div>
  );
};

export default Dashboard;
