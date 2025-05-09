'use client';

import { useState, useEffect } from 'react';

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [botInfo, setBotInfo] = useState<{username?: string} | null>(null);

  // Bot configuration
  const BOT_TOKEN = '7943897874:AAFN0SB8zF6QW2sH3hJA1DaJ12Y1qnyDozk';
  // Use this actual chat ID from my account for testing
  const CHAT_ID = '575698739';

  // Fetch bot information when component mounts
  useEffect(() => {
    const fetchBotInfo = async () => {
      try {
        const response = await fetch('/api/telegram-bot-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bot_token: BOT_TOKEN }),
        });
        
        const data = await response.json();
        
        if (data.success && data.bot_info) {
          console.log('Bot info retrieved:', data.bot_info);
          setBotInfo(data.bot_info);
        } else {
          console.error('Failed to get bot info:', data.error);
        }
      } catch (error) {
        console.error('Error fetching bot info:', error);
      }
    };
    
    fetchBotInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendToTelegram = async (data: typeof formState) => {
    const text = `📨 New request from website:
👤 Name: ${data.name}
📞 Phone: ${data.phone}
💬 Message: ${data.message}`;

    console.log('Preparing to send message to Telegram');
    console.log('Using chat_id:', CHAT_ID);
    
    try {
      // Use our proxy API endpoint instead of calling Telegram directly
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_token: BOT_TOKEN,
          chat_id: CHAT_ID,
          text: text,
        }),
      });

      const responseText = await response.text();
      console.log('Raw API response text:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('API response data:', responseData);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        responseData = { error: 'Invalid JSON response' };
      }

      if (response.ok) {
        return responseData;
      } else {
        setDebugInfo(`API Error: ${responseData.error || 'Unknown error'}`);
        throw new Error(`Failed to send message: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending to Telegram:', error);
      setDebugInfo(`Fetch Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!CHAT_ID) {
      alert('Please set the CHAT_ID variable in ContactSection.tsx with your Telegram chat ID');
      return;
    }

    setIsSubmitting(true);
    setDebugInfo(null);
    console.log('Form submitted with data:', formState);
    
    try {
      await sendToTelegram(formState);
      alert('Сообщение отправлено!');
      setFormState({
        name: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      alert(`Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the bot activation link
  const getBotActivationLink = () => {
    if (botInfo && botInfo.username) {
      return `https://t.me/${botInfo.username}`;
    }
    // Fallback to a hardcoded link
    return 'https://t.me/cranmontaj_bot';
  };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      {/* Contact Form Card */}
      <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group hover:shadow-xl bg-white">
        {/* Card background with refined gradient border */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-lg z-0 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]"></div>
        
        {/* Main card body with improved background */}
        <div className="relative flex flex-col h-full z-10 bg-gradient-to-b from-[#F7FAFD] to-[#F0F5FA] rounded-lg m-[1px] border border-amber-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02]">
          <div className="p-8">
            <div className="mb-6">
              <div className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-l-4 border-l-amber-500 mb-4">
                Обратная связь
              </div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
                Оставьте заявку
                <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mt-2"></div>
              </h3>
              <p className="mt-3 text-gray-600">
                Заполните форму и мы свяжемся с вами в ближайшее время
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formState.name}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                  className="py-3 px-4 block w-full shadow-sm border-gray-300 rounded-md text-gray-700 bg-white/70 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all duration-300"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                  className="py-3 px-4 block w-full shadow-sm border-gray-300 rounded-md text-gray-700 bg-white/70 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all duration-300"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Сообщение
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formState.message}
                  onChange={handleChange}
                  required
                  className="py-3 px-4 block w-full shadow-sm border-gray-300 rounded-md text-gray-700 bg-white/70 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all duration-300"
                ></textarea>
              </div>
              
              <div className="pt-2 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/40 via-amber-400/40 to-amber-500/40 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full relative inline-flex items-center justify-center px-6 py-3 border border-amber-600 bg-gradient-to-r from-amber-600 to-amber-500 rounded-md text-white font-medium hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-sm z-10 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform duration-500 group-hover:translate-x-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-700 group-hover:w-full"></span>
                </button>
              </div>
              
              {debugInfo && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  <p>Debug info: {debugInfo}</p>
                  {debugInfo.includes('chat not found') && (
                    <div className="mt-2">
                      <p>Вам нужно активировать бота, отправив ему сообщение первым:</p>
                      <a 
                        href={getBotActivationLink()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:text-amber-700 font-medium border-b border-amber-300 hover:border-amber-500 transition-colors"
                      >
                        Активировать бота в Telegram
                      </a>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      
      {/* Contact Information Card */}
      <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group hover:shadow-xl">
        {/* Card background with refined gradient border */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-lg z-0 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]"></div>
        
        {/* Main card body with improved background */}
        <div className="relative flex flex-col h-full z-10 bg-gradient-to-b from-[#F7FAFD] to-[#F0F5FA] rounded-lg m-[1px] border border-amber-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02]">
          <div className="p-8">
            <div className="mb-6">
              <div className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-l-4 border-l-amber-500 mb-4">
                Контакты
              </div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
                Контактная информация
                <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mt-2"></div>
              </h3>
              <p className="mt-3 text-gray-600">
                Свяжитесь с нами любым удобным для вас способом
              </p>
            </div>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start group">
                <div className="flex-shrink-0 p-2 bg-amber-50 rounded-md group-hover:bg-amber-100 transition-colors duration-300">
                  <svg className="h-6 w-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-800 group-hover:text-amber-700 transition-colors">Наш адрес</h4>
                  <p className="mt-1 text-gray-600">21 Revolution Street Paris, France</p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="flex-shrink-0 p-2 bg-amber-50 rounded-md group-hover:bg-amber-100 transition-colors duration-300">
                  <svg className="h-6 w-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-800 group-hover:text-amber-700 transition-colors">Email</h4>
                  <p className="mt-1 text-gray-600">support@company.com</p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="flex-shrink-0 p-2 bg-amber-50 rounded-md group-hover:bg-amber-100 transition-colors duration-300">
                  <svg className="h-6 w-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-800 group-hover:text-amber-700 transition-colors">Телефон</h4>
                  <p className="mt-1 text-gray-600">+1 555 123456</p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="flex-shrink-0 p-2 bg-amber-50 rounded-md group-hover:bg-amber-100 transition-colors duration-300">
                  <svg className="h-6 w-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-800 group-hover:text-amber-700 transition-colors">Рабочие часы</h4>
                  <p className="mt-1 text-gray-600">(Пн-Сб) с 9:00 до 18:00</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 relative overflow-hidden rounded-md">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-md"></div>
              <iframe
                title="Карта"
                className="w-full h-60 rounded-md relative z-10 border border-amber-100"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9914406081493!2d2.292292615201654!3d48.85837360866272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2sus!4v1626544297528!5m2!1sen!2sus"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 