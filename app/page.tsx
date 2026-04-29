'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { CarouselApi } from '@/components/ui/carousel';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Calendar, Phone, Clock, Users, Stethoscope, Video, Bell, Heart } from 'lucide-react';
import MainHeader from '@/components/main-header';

const content = {
  en: {
    header: 'Rasheed Shekoni Federal University Dutse Teaching Hospital',
    subheader: 'Excellence in Healthcare with Digital Innovation',
    tagline: 'Quality Care. Modern Technology. Patient First.',
    services: [
      { title: 'Appointment Booking', desc: 'Book clinic visits online and reduce waiting time.', icon: Calendar },
      { title: 'Telemedicine', desc: 'Video consultations with doctors from your home.', icon: Video },
      { title: 'Notifications', desc: 'Automated reminders for visits and medication schedules.', icon: Bell },
    ],
    departments: [
      { name: 'General Medicine', icon: Stethoscope },
      { name: 'Surgery', icon: Heart },
      { name: 'Emergency Care', icon: Phone },
      { name: 'Pediatrics', icon: Users },
    ],
    aboutTitle: 'About RSFUDTH',
    aboutText:
      'Rasheed Shekoni Federal University Dutse Teaching Hospital is a premier healthcare institution in Jigawa State, Nigeria. We provide world-class clinical services, research, and training with modern facilities and compassionate care.',
    mdTitle: 'Message from the Managing Director',
    mdMessage:
      'Welcome to Rasheed Shekoni Federal University Dutse Teaching Hospital. As your Managing Director, I am committed to providing exceptional healthcare services that prioritize patient safety, clinical excellence, and compassionate care. Our state-of-the-art facilities and dedicated medical professionals work tirelessly to serve our community with the highest standards of medical practice. Together, we are building a healthier future for Jigawa State and beyond.',
    cta: 'Get Started',
  },
  ha: {
    header: 'Rasheed Shekoni Federal University Dutse Teaching Hospital',
    subheader: 'Kilakin duk ta Lafiya tare da Sabbin Fasaha',
    tagline: 'Kyakkyawan Kulawa. Sabbin Fasaha. Majiya Abin Damowa.',
    services: [
      { title: 'Rajistar Zama', desc: 'Yi ajiyar ganawa da likita cikin sauƙi.' },
      { title: 'Telemedicine', desc: 'Ganawa ta bidiyo daga gida.' },
      { title: 'Sanarwa', desc: 'Tunatarwar ganawa da magani ta atomatik.' },
    ],
    departments: [
      { name: 'Likitanci Gida', icon: Stethoscope },
      { name: 'Watsewa', icon: Heart },
      { name: 'Gaijin Aiki', icon: Phone },
      { name: 'Jinya-Jiya', icon: Users },
    ],
    aboutTitle: 'Game da RSFUDTH',
    aboutText:
      'Rasheed Shekoni Federal University Dutse Teaching Hospital shine babbar gida na lafiya a Jihar Jigawa, Najeriya. Mun ba da kilakin likitanci, bincike, da horo tare da sabbin kayan aiki da kulawa mai tausayi.',
    mdTitle: 'Saƙo daga Manajan Gudanarwa',
    mdMessage:
      'Barka da zuwa Rasheed Shekoni Federal University Dutse Teaching Hospital. A matsayina na Manajan Gudanarwa, na himmatu wajen ba da sabis na lafiya na musamman waɗanda ke ba da fifiko ga amincin majiya, ƙwarewar likitanci, da kulawa mai tausayi. Sabbin kayan aikinmu da ƙwararrun likitocinmu suna aiki ba tare da gajiya ba don bawa al\'ummarmu da mafi girman ƙa\'idojin aikin likitanci. Tare, muna gina makoma mai lafiya ga Jihar Jigawa da maƙwabta.',
    cta: 'Fara Yanzu',
  },
};

export default function Home() {
  const [lang, setLang] = useState<'en' | 'ha'>('en');
  const t = useMemo(() => content[lang], [lang]);

  const heroSlides = [
    '/A1.png',
    '/A2.jpeg',
  ];

  const gallerySlides = [
    '/gallery-1.jpg',
    '/gallery-2.jpg',
    '/gallery-3.jpg',
    '/gallery-4.jpg',
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [galleryApi, setGalleryApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (!galleryApi) return;

    const timer = setInterval(() => {
      galleryApi.scrollNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [galleryApi]);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">      <MainHeader />        {/* Hero Section */}
        <section id="home" className="relative overflow-hidden min-h-screen">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <img
              key={slide}
              src={slide}
              alt={`RSFUDTH slide ${index + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                index === activeSlide ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden="true"
              onLoad={() => console.log(`Image loaded: ${slide}`)}
              onError={(e) => {
                console.error(`Failed to load image: ${slide}`);
                e.currentTarget.style.display = 'none';
              }}
            />
          ))}
          <div className="absolute inset-0 bg-linear-to-r from-emerald-900/30 via-slate-900/25 to-emerald-900/30" aria-hidden="true" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="max-w-2xl text-white">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">{t.tagline}</p>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                {t.header}
              </h1>
              <p className="mt-4 text-lg leading-relaxed">
                {t.subheader}
              </p>
              <p className="mt-4 text-base text-emerald-100">
                Access quality healthcare services anytime, anywhere
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/patient/appointments/book"
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-emerald-400 px-7 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-100"
                >
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Link>
                <Link
                  href="#services"
                  className="inline-flex w-fit items-center justify-center rounded-md border-2 border-white bg-white/20 px-7 py-3 text-sm font-semibold text-white hover:bg-white/30"
                >
                  View Services
                </Link>
              </div>
            </div>

            <div className="hidden rounded-2xl border-2 border-white/30 bg-white/10 p-6 shadow-2xl backdrop-blur-md lg:block">
              <img
                src="/Logo.png"
                alt="RSFUDTH Hospital Logo"
                className="h-80 w-full rounded-xl object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="bg-linear-to-r from-emerald-50 to-blue-50 py-8 dark:from-slate-900 dark:to-slate-800 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Emergency</p>
                  <p className="font-bold text-emerald-700">24/7 Available</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <Phone className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Call Us</p>
                  <p className="font-bold text-emerald-700">+234 (0) 123</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Book Now</p>
                  <p className="font-bold text-emerald-700">Easy & Fast</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <Video className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Consult Online</p>
                  <p className="font-bold text-emerald-700">Remote Visit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Our Platform</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Key Services</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Comprehensive healthcare management solutions designed for your convenience
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.map((service, idx) => {
            const Icon = (service as any).icon || Calendar;
            return (
              <article
                key={idx}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-600"
              >
                <Icon className="h-10 w-10 text-emerald-600 transition group-hover:scale-110" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{service.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="bg-slate-50 py-16 dark:bg-slate-900 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Specialized Care</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Our Departments</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
              World-class medical departments staffed by experienced specialists across multiple disciplines
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.departments.map((dept, idx) => {
              const Icon = dept.icon || Stethoscope;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-emerald-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800"
                >
                  <Icon className="mx-auto h-10 w-10 text-emerald-600" />
                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{dept.name}</h3>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/departments"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-100"
            >
              View All Departments (16 Specialties)
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Hospital Gallery</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Explore Our Facilities</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Discover the hospital facilities, patient care spaces, and modern clinical environments.
          </p>
        </div>

        <div className="mt-12 relative">
          <Carousel className="relative" setApi={setGalleryApi}>
            <CarouselContent className="flex gap-4">
              {gallerySlides.map((slide, idx) => (
                <CarouselItem key={slide}>
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    <img
                      src={slide}
                      alt={`Gallery image ${idx + 1}`}
                      className="h-screen w-full object-cover transition duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:block" />
            <CarouselNext className="hidden sm:block" />
          </Carousel>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            {gallerySlides.map((_, idx) => (
              <span key={idx} className="rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                Slide {idx + 1}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">About Us</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">{t.aboutTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {t.aboutText}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900">✓</span>
                Quality medical care with compassion
              </li>
              <li className="flex gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900">✓</span>
                Electronic health records and secure access
              </li>
              <li className="flex gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900">✓</span>
                Research and training excellence
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-blue-50 p-8 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
            <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">National Trust</h3>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              As a Federal Teaching Hospital, RSFUDTH maintains the highest standards of clinical practice, medical education, and research, serving as a beacon of healthcare excellence in Nigeria.
            </p>
            <div className="mt-6 space-y-2 border-t border-emerald-200 pt-6 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Hospital Registration</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">Federal Teaching Hospital • Jigawa State • Nigeria</p>
            </div>
          </div>
        </div>
      </section>

      {/* Managing Director Section */}
      <section className="bg-linear-to-r from-slate-50 to-emerald-50 py-16 dark:from-slate-900 dark:to-emerald-900/20 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Leadership Message</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">{t.mdTitle}</h2>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-xl border border-emerald-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <blockquote>
                  <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 italic">
                    "{t.mdMessage}"
                  </p>
                  <footer className="mt-6">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">DR. SALISU MU'AZU BABURA MBBS (UNIJOS), MPA(ABU), FMCP(NIG), FACE.</p>
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">Managing Director</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Rasheed Shekoni Federal University Dutse Teaching Hospital</p>
                  </footer>
                </blockquote>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src="/md.jpeg"
                    alt="Managing Director"
                    className="h-80 w-80 rounded-xl object-cover shadow-lg border-4 border-white dark:border-slate-700"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-4 -right-4 rounded-full bg-emerald-600 p-3 shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-emerald-600 to-emerald-700 py-16 dark:from-emerald-900 dark:to-emerald-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Take Control of Your Health?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-emerald-100">
            Join thousands of patients who trust RSFUDTH for quality healthcare services.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/patient/appointments/book"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 sm:w-auto"
            >
              <Calendar className="h-5 w-5" />
              Book an Appointment
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white bg-transparent px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 sm:w-auto"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-200 bg-slate-900 px-4 py-12 text-slate-300 dark:border-slate-800 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h4 className="font-semibold text-white">RSFUDTH Portal</h4>
              <p className="mt-2 text-sm">
                Rasheed Shekoni Federal University Dutse Teaching Hospital
              </p>
              <p className="mt-1 text-sm">Jigawa State, Nigeria</p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Quick Links</h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li><a href="#home" className="hover:text-emerald-400">Home</a></li>
                <li><a href="#services" className="hover:text-emerald-400">Services</a></li>
                <li><a href="#departments" className="hover:text-emerald-400">Departments</a></li>
                <li><a href="#about" className="hover:text-emerald-400">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Contact</h4>
              <p className="mt-2 text-sm">📞 +234 123 456 7890</p>
              <p className="text-sm">📧 info@rsfudth.ng</p>
              <p className="mt-2 text-xs">Hours: Mon-Fri 8AM-5PM (Local Time)</p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Account</h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li><Link href="/auth/login" className="hover:text-emerald-400">Login</Link></li>
                <li><Link href="/auth/register" className="hover:text-emerald-400">Register</Link></li>
                <li><a href="#" className="hover:text-emerald-400">Forgot Password</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-700 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Rasheed Shekoni Federal University Dutse Teaching Hospital. All rights reserved.</p>
            <p className="mt-2 text-xs text-slate-500">Committed to excellence in healthcare delivery and medical research.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
