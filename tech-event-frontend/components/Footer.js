const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} TechVerse. All rights reserved.</p>
          <div className="mt-2">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mr-4 hover:underline">
              Twitter
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="mr-4 hover:underline">
              Facebook
            </a>
            <a href="https://linkedIn.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  