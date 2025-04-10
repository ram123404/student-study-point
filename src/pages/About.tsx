
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Users, Award, BookMarked } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 md:px-6">
          <h1 className="text-4xl font-bold mb-8 text-center gradient-heading">About StudyPoint</h1>
          
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 mb-12">
            <p className="text-lg text-gray-700 mb-6">
              StudyPoint is a dedicated platform designed to support BCA (Bachelor of Computer Applications) students in their academic journey. We understand the challenges students face in accessing quality study materials, which is why we've created this repository of resources to help you excel in your studies.
            </p>
            
            <p className="text-lg text-gray-700 mb-6">
              Our platform offers a comprehensive collection of notes, past exam questions, and syllabi, all organized by semester and subject for easy navigation. Whether you're preparing for exams, looking to deepen your understanding of specific topics, or planning your study schedule, StudyPoint has you covered.
            </p>
            
            <p className="text-lg text-gray-700">
              Currently focused on BCA, we plan to expand our offerings to include more courses like BBA, BIM, and BSc CSIT in the future, creating a one-stop resource hub for all computer science and business students.
            </p>
          </div>
          
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose StudyPoint?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Curated Resources</h3>
                <p className="text-gray-600">
                  All materials are carefully selected and organized by experienced educators and top-performing students to ensure quality and relevance.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <BookMarked className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Coverage</h3>
                <p className="text-gray-600">
                  From first semester to eighth, we cover all subjects in the BCA curriculum with detailed notes and exam preparation materials.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Community-Driven</h3>
                <p className="text-gray-600">
                  Our platform grows with input from students and faculty, ensuring the resources remain current and address real educational needs.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Academic Excellence</h3>
                <p className="text-gray-600">
                  Our ultimate goal is to help you achieve the highest standards in your academic performance through quality resources and support.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Start exploring our resources today and take a step toward academic excellence.
            </p>
            <Button asChild size="lg">
              <Link to="/resources">Browse Resources</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
