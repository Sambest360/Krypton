import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Shield, Globe, Users, Check } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-md bg-trading-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">KP</span>
          </div>
          <h1 className="text-xl font-bold">Krypton</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link to="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link to="/#about" className="text-muted-foreground hover:text-foreground transition-colors">
            About Us
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="bg-trading-primary hover:bg-trading-secondary">Register</Button>
          </Link>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Trade with Confidence on Krypton
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                The premier platform for cryptocurrency and fiat currency trading.
                Start your investment journey today with secure, fast, and easy trading.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-trading-primary hover:bg-trading-secondary">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Login to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative">
                {/* Mock dashboard image */}
                <div className="w-full max-w-md bg-card rounded-lg shadow-xl overflow-hidden border">
                  <div className="p-4 bg-muted">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <div className="ml-2 h-5 w-32 bg-muted-foreground/20 rounded"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="h-6 w-1/2 bg-muted-foreground/20 rounded"></div>
                      <div className="h-10 w-3/4 bg-muted-foreground/10 rounded"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-trading-primary/10 rounded"></div>
                        <div className="h-24 bg-trading-primary/10 rounded"></div>
                        <div className="h-24 bg-trading-primary/10 rounded"></div>
                        <div className="h-24 bg-trading-primary/10 rounded"></div>
                      </div>
                      <div className="h-40 bg-muted-foreground/10 rounded"></div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-trading-primary/20 z-0"></div>
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-trading-primary/10 z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Krypton?</h2>
            <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
              Our platform offers everything you need to trade cryptocurrencies and fiat currencies with ease and security.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-trading-primary/10 flex items-center justify-center mb-6">
                  <TrendingUp size={24} className="text-trading-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Trading</h3>
                <p className="text-muted-foreground">
                  Access to powerful trading tools and real-time market data for informed decisions.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-trading-primary/10 flex items-center justify-center mb-6">
                  <Shield size={24} className="text-trading-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bank-Grade Security</h3>
                <p className="text-muted-foreground">
                  Your assets are protected with enterprise-level security and encryption.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-trading-primary/10 flex items-center justify-center mb-6">
                  <Globe size={24} className="text-trading-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Global Support</h3>
                <p className="text-muted-foreground">
                  Trade multiple currencies and get support from our global team 24/7.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-trading-primary/10 flex items-center justify-center mb-6">
                  <Users size={24} className="text-trading-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">User-Friendly</h3>
                <p className="text-muted-foreground">
                  Intuitive interface designed for both beginners and experienced traders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-trading-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Trading?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users already trading on our platform. 
            Create your free account today and start your investment journey.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-trading-primary hover:bg-trading-secondary">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-md bg-trading-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">KP</span>
                </div>
                <h3 className="text-lg font-bold">Krypton</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                The premier platform for cryptocurrency and fiat currency trading.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Security</a></li>
                <li><a href="#" className="hover:text-foreground">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-muted-foreground/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Krypton. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
