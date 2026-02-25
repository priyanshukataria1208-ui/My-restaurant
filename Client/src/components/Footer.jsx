import React from 'react';
import { UtensilsCrossed, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900/80 border-t border-gray-800 mt-auto">
      {/* Advertisement Section */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-b border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Special Offer */}
            <div className="bg-white/5 border border-gray-700/50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">20% OFF</div>
              <p className="text-gray-300 text-sm">On your first order</p>
              <p className="text-gray-400 text-xs mt-1">Use code: FIRST20</p>
            </div>

            {/* Free Delivery */}
            <div className="bg-white/5 border border-gray-700/50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">FREE</div>
              <p className="text-gray-300 text-sm">Delivery on orders above ₹500</p>
              <p className="text-gray-400 text-xs mt-1">Valid for all locations</p>
            </div>

            {/* Loyalty Program */}
            <div className="bg-white/5 border border-gray-700/50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">EARN</div>
              <p className="text-gray-300 text-sm">Points on every order</p>
              <p className="text-gray-400 text-xs mt-1">Join our loyalty program</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-gray-200" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">SavoryBites</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Restaurant Management</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Serving delicious vegetarian cuisine with a commitment to quality, freshness, and exceptional service since 2015.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Our Menu
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Reservations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Events & Catering
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Gift Cards
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Branch Locations */}
          <div>
            <h4 className="text-white font-semibold mb-4">Our Branches</h4>
            <ul className="space-y-3">
              <li>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Mumbai - Bandra</p>
                    <p className="text-gray-400 text-xs">123 Hill Road, Bandra West</p>
                    <p className="text-gray-500 text-xs">Mumbai - 400050</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Delhi - Connaught Place</p>
                    <p className="text-gray-400 text-xs">45 Block A, Connaught Place</p>
                    <p className="text-gray-500 text-xs">New Delhi - 110001</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Bangalore - Koramangala</p>
                    <p className="text-gray-400 text-xs">78 5th Block, Koramangala</p>
                    <p className="text-gray-500 text-xs">Bangalore - 560095</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Call Us</p>
                  <a href="tel:+919876543210" className="text-white text-sm hover:text-gray-300 transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Email Us</p>
                  <a href="mailto:info@savorybites.com" className="text-white text-sm hover:text-gray-300 transition-colors">
                    info@savorybites.com
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Opening Hours</p>
                  <p className="text-white text-sm">Mon - Sun: 11:00 AM - 11:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2024 SavoryBites. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer