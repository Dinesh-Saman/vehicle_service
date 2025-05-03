import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../systemoperationmanagement/assets/Levaggio.png';

const ReceiptTable = () => {
    const [receipts, setReceipts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCharts, setShowCharts] = useState(false);

    useEffect(() => {
        const storedReceipts = JSON.parse(localStorage.getItem('receipts')) || [];
        setReceipts(storedReceipts);
    }, []);

    const handleDelete = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedReceipts = receipts.filter((_, i) => i !== index);
                setReceipts(updatedReceipts);
                localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
                Swal.fire('Deleted!', 'Your receipt has been deleted.', 'success');
            }
        });
    };

    const filteredReceipts = receipts.filter(receipt =>
        receipt.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.receiptId.toString().includes(searchQuery)
    );

    const totalPrice = filteredReceipts.reduce((sum, receipt) => sum + parseFloat(receipt.totalPrice || 0), 0);
    const totalPackages = filteredReceipts.length;

    const allPackages = [...new Set(receipts.map(receipt => receipt.packageName))];

    const packageCounts = allPackages.map(packageName => {
        const count = filteredReceipts.filter(receipt => receipt.packageName === packageName).length;
        return {
            packageName,
            count
        };
    });

    const availabilityData = {
        labels: packageCounts.map(item => item.packageName),
        datasets: [{
            data: packageCounts.map(item => item.count),
            backgroundColor: ['#FF6384', '#FF9F40', '#FFCD3C', '#4BC0C0', '#9966FF'],
            hoverBackgroundColor: ['#FF6384', '#FF9F40', '#FFCD3C', '#4BC0C0', '#9966FF']
        }]
    };

    const minMaxPriceData = {
        labels: packageCounts.map(item => item.packageName),
        datasets: [{
            label: 'Price Range',
            data: packageCounts.map(item => parseFloat(item.count)),
            backgroundColor: '#FF9F40',
            borderColor: '#FF9F40',
            borderWidth: 1,
        }]
    };

    const generateReport = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const currentDate = new Date().toLocaleDateString();

        // Add outline to the PDF report
        doc.setLineWidth(1);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Draw rectangle with margins

        // Add header with logo, title, and date
        doc.setFontSize(18);
        const imgWidth = 40;
        const imgHeight = 40;
        const imgX = (pageWidth - imgWidth) / 2; // Center horizontally
        doc.addImage(logo, 'PNG', imgX, 15, imgWidth, imgHeight, undefined, 'FAST'); // Centered and rounded logo

        doc.setFontSize(14);
        doc.text('Levaiggo Booking Report', pageWidth / 2, 70, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 80, { align: 'center' });

        // Add total revenue section
        doc.setFontSize(12);
        doc.text('Total Revenue: $' + totalPrice.toFixed(2), 14, 95);

        // Add table with booking details
        doc.setFontSize(12);
        doc.text('Booking Details:', 14, 110);
        
        const rows = filteredReceipts.map(receipt => ([ 
            receipt.packageName, 
            `$${receipt.originalPrice}`, 
            `${receipt.discount}%`, 
            `$${receipt.totalPrice}`, 
            receipt.bookingDate, 
            receipt.paymentMethod 
        ]));

        doc.autoTable({
            head: [['Package Name', 'Original Price', 'Discount', 'Total Price', 'Booking Date', 'Payment Method']],
            body: rows,
            startY: 115,
            theme: 'striped',
            styles: {
                lineColor: [0, 0, 0],
                lineWidth: 0.1,
            },
            margin: { left: 14, right: 14 }
        });

        // Add footer with page number and signature area
        const totalPages = doc.internal.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            const pageNoText = `Page ${i} of ${totalPages}`;
            doc.setFontSize(10);
            doc.text(pageNoText, pageWidth / 2, pageHeight - 10, { align: 'center' });
            doc.text('Authorized Signature: Pasindu ___________________', 14, pageHeight - 10);
        }

        doc.save('Booking_Report.pdf');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-opacity-75  style={{ minHeight: '100vh', marginTop: '80px' }}">
            <div className="card shadow-lg p-1" style={{ backgroundColor: '#f0f8ff', borderRadius: '20px', maxWidth: '90%', border: '1px solid #ccc' }}>
                <h2 className="text-center mb-4" style={{ color: '#333' }}>Booking Table</h2>

                <div className="d-flex justify-content-between mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Receipt ID or Package Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ maxWidth: '300px' }}
                    />
                    <div>
                        <p style={{ color: '#333' }}><strong>Total Packages:</strong> {totalPackages}</p>
                        <p style={{ color: '#333' }}><strong>Total Revenue:</strong> ${totalPrice.toFixed(2)}</p>
                    </div>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="table table-striped table-hover table-bordered" style={{ backgroundColor: '#fff' }}>
                        <thead className="table-dark">
                            <tr>
                                <th className="text-end">Receipt ID</th>
                                <th>Package Name</th>
                                <th className="text-end">Original Price</th>
                                <th className="text-end">Discount</th>
                                <th className="text-end">Total Price</th>
                                <th className="text-end">Date of Booking</th>
                                <th className="text-end">Payment Method</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReceipts.map((receipt, index) => (
                                <tr key={index}>
                                    <td className="text-end">{receipt.receiptId}</td>
                                    <td>{receipt.packageName}</td>
                                    <td className="text-end">${receipt.originalPrice}</td>
                                    <td className="text-end">{receipt.discount}% (-${receipt.discountAmount})</td>
                                    <td className="text-end">${receipt.totalPrice}</td>
                                    <td className="text-end">{receipt.bookingDate}</td>
                                    <td className="text-end">{receipt.paymentMethod}</td>
                                    <td className="text-center">
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(index)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="text-center mt-4">
                    <button 
                        onClick={() => setShowCharts(true)} 
                        className="btn me-2"
                        style={{ 
                            backgroundColor: '#FF5733',
                            color: '#fff',
                            width: '150px',
                            height: '45px',
                            border: 'none',
                            borderRadius: '5px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C70039'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF5733'}
                    >
                        Show Charts
                    </button>
                    <button 
                        onClick={generateReport} 
                        className="btn"
                        style={{ 
                            backgroundColor: '#28a745',
                            color: '#fff',
                            width: '150px',
                            height: '45px',
                            border: 'none',
                            borderRadius: '5px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                    >
                        Generate PDF
                    </button>
                </div>

                <Modal show={showCharts} onHide={() => setShowCharts(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Charts Overview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5 className="text-center">Package Distribution</h5>
                        <Pie data={availabilityData} />
                        <h5 className="text-center mt-4">Total Price Distribution</h5>
                        <Bar data={minMaxPriceData} />
                    </Modal.Body>
                   
                </Modal>
            </div>
        </div>
    );
};

export default ReceiptTable;
