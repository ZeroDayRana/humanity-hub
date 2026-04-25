const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 px-4">
                <div>
                    <h3 className="text-lg font-bold text-white">HumanityHub</h3>
                    <p className="text-sm mt-2">Making charity easy and transparent.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-white">Quick Links</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                        <li>Home</li>
                        <li>Campaigns</li>
                        <li>Start Fundraiser</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-white">Contact</h4>
                    <p className="text-sm mt-2">support@helphub.com</p>
                </div>
            </div>
            <p className="text-center text-sm mt-6">© 2026 HelpHub. All rights reserved.</p>
        </footer>
    )
}

export default Footer