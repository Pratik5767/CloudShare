import { features, pricingPlans, testimonials } from "../assets/data"
import CTASection from "../components/landing/CTASection"
import FeaturesSection from "../components/landing/FeaturesSection"
import Footer from "../components/landing/Footer"
import HeroSection from "../components/landing/HeroSection"
import PricingSection from "../components/landing/PricingSection"
import TestimonialSection from "../components/landing/TestimonialSection"

const Landing = () => {
    return (
        <div className="landing-page bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Section */}
            <HeroSection />
            
            {/* Features Section */}
            <FeaturesSection features={features}/>
            
            {/* Pricing Section */}
            <PricingSection pricingPlans={pricingPlans}/>
            
            {/* Testimonial Section */}
            <TestimonialSection testimonials={testimonials}/>
            
            {/* CTA Section */}
            <CTASection/>
            
            {/* Footer Section */}
            <Footer />
        </div>
    )
}

export default Landing