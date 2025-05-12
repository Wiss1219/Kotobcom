import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
const ContactPage = () => {
  const {
    t,
    language
  } = useLanguage();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to a backend
    alert('Message sent successfully!');
  };
  return <div className="container py-12">
      <h1 className={`text-3xl font-bold text-kotob-blue mb-8 ${language === 'ar' ? 'text-right' : ''}`}>
        {t('contactUs')}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="">
          <h2 className="text-xl font-bold mb-6">{t('sendMessage')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">{t('yourName')}</label>
              <Input id="name" type="text" placeholder={t('yourName')} required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">{t('yourEmail')}</label>
              <Input id="email" type="email" placeholder={t('yourEmail')} required />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">{t('message')}</label>
              <Textarea id="message" placeholder={t('message')} rows={5} required />
            </div>
            <Button type="submit" className="bg-kotob-blue hover:bg-blue-700 w-full">
              <Send className="h-4 w-4 mr-2" />
              {t('submit')}
            </Button>
          </form>
        </div>
        
        {/* Contact Information */}
        <div className="bg-transparent">
          <h2 className="text-xl font-bold mb-6">{t('contactUs')}</h2>
          <div className="space-y-6">
            <div className={`flex ${language === 'ar' ? 'flex-row-reverse text-right' : ''} items-start`}>
              <div className="mt-1 bg-kotob-blue p-2 rounded-full text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <h3 className="font-medium">{t('address')}</h3>
                
              </div>
            </div>
            
            <div className={`flex ${language === 'ar' ? 'flex-row-reverse text-right' : ''} items-start`}>
              <div className="mt-1 bg-kotob-blue p-2 rounded-full text-white">
                <Phone className="h-5 w-5" />
              </div>
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <h3 className="font-medium">Phone Number</h3>
                <p className="mt-1 text-gray-400">+216 73 123 456</p>
                <p className="text-gray-400">+216 99 987 654</p>
              </div>
            </div>
            
            <div className={`flex ${language === 'ar' ? 'flex-row-reverse text-right' : ''} items-start`}>
              <div className="mt-1 bg-kotob-blue p-2 rounded-full text-white">
                <Mail className="h-5 w-5" />
              </div>
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <h3 className="font-medium">Email Address</h3>
                <p className="mt-1 text-gray-400">info@kotobcom.tn</p>
                <p className="text-gray-400">support@kotobcom.tn</p>
              </div>
            </div>
            
            <div className={`flex ${language === 'ar' ? 'flex-row-reverse text-right' : ''} items-start`}>
              <div className="mt-1 bg-kotob-blue p-2 rounded-full text-white">
                <Clock className="h-5 w-5" />
              </div>
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <h3 className="font-medium">Working Hours</h3>
                <p className="mt-1 text-gray-400">Monday to Friday: 9:00 AM - 7:00 PM</p>
                <p className="text-zinc-400">Saturday: 9:00 AM - 5:00 PM</p>
                <p className="text-gray-400">Sunday: Closed</p>
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="mt-8">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25967.470972914156!2d10.5655!3d35.7276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13021582e14fa5b1%3A0x8c0a0a6e7c157059!2sMsaken!5e0!3m2!1sen!2stn!4v1649099200000!5m2!1sen!2stn" width="100%" height="300" style={{
            border: 0
          }} allowFullScreen={false} loading="lazy" title="Kotobcom Location" className="rounded-lg shadow"></iframe>
          </div>
        </div>
      </div>
    </div>;
};
export default ContactPage;