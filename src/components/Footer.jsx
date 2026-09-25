import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 mt-auto">
      {/* Quick Navigation Links */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <Link
              to="/wishlist"
              className="btn-secondary px-6 py-2.5 text-sm w-full sm:w-auto text-center"
            >
              My Wishlist
            </Link>
            <Link
              to="/cart"
              className="btn-primary px-6 py-2.5 text-sm w-full sm:w-auto text-center"
            >
              Go to Cart
            </Link>
            <Link
              to="/account"
              className="btn-secondary px-6 py-2.5 text-sm w-full sm:w-auto text-center"
            >
              Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              TastyBites
            </span>
            <span className="text-slate-600 text-sm">| Fresh meals, delivered fast.</span>
          </div>
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} TastyBites. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
