
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">StudyPoint</span>
            </Link>
            <p className="mt-4 text-gray-600 text-sm">
              Your go-to platform for BCA academic resources, notes, and past exam questions.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail size={16} />
                <span>contact@studypoint.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <Github size={16} />
                <a href="https://github.com/studypoint" className="hover:text-primary transition-colors">
                  github.com/studypoint
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>© {currentYear} StudyPoint. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
