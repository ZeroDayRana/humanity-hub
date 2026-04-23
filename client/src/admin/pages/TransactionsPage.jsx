import { useState, useMemo } from "react";
import { Download } from "lucide-react";
import { useDonation } from "../../context/donationContext";

export default function TransactionsPage() {
    const { donations } = useDonation(); // Get donations from context
    const [search, setSearch] = useState("");
    const [result, setResult] = useState([]);

    // const transactions = [
    //     { id: 1, name: "Mohit Sharma", amount: 500, date: "2026-04-20", status: "success" },
    //     { id: 2, name: "Amit Verma", amount: 1200, date: "2026-04-19", status: "failed" },
    //     { id: 3, name: "Riya Singh", amount: 300, date: "2026-04-18", status: "success" }
    // ];

    const transactions = donations.map(d => ({
        id: d.id,
        name: d.donorName,
        campaignId: d.campaignId,
        campaignTitle: d.Campaign.title, // ✅ get campaign title
        amount: d.amount,
        date: d.createdAt,
        status: d.paymentStatus
    }));

    const filtered = useMemo(() => {
        return transactions.filter((t) =>
            t.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [transactions, search]);

    const grouped = filtered.reduce((acc, d) => {
        const key = `${d.name}-${d.campaignId}`; // Group by donor name and campaign ID
        if (!acc[key]) {
            //Generate a unique key for each donor-campaign combination and initialize the group
            acc[key] = {
                name: d.name,
                campaignTitle: d.campaignTitle,
                totalAmount: 0,
                date: d.date,
                status: d.status
            }
        }
        acc[key].totalAmount += d.amount; // Sum amounts for the same donor and campaign
        return acc;
    }, {});

    const sorted = Object.values(grouped).sort((a, b) => b.totalAmount - a.totalAmount);

    const downloadCSV = () => {
        const headers = ["Name", "Campaign", "Amount", "Date", "Status"];
        const rows = sorted.map(t => [
            t.name,
            t.campaignTitle,
            t.totalAmount,
            t.date,
            t.status
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + [headers, ...rows].map(e => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Transactions</h1>

            {/* Top Controls */}
            <div className="flex justify-between items-center mb-4 gap-2">
                <input
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button onClick={downloadCSV} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors">
                    <Download size={16} /> Export CSV
                </button>
            </div>

            {/* Table */}

            <div className="p-4 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">Donor</th>
                            <th>Campaign</th>
                            <th>Amount (₹)</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((t) => (
                            <tr key={t.id} className="border-b hover:bg-gray-50">
                                <td className="py-2">{t.name}</td>
                                <td>{t.campaignTitle}</td>
                                <td>₹{t.totalAmount}</td>
                                <td>{t.date}</td>
                                <td>
                                    <span
                                        className={`px-2 py-1 rounded text-sm font-medium ${t.status === "success"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
