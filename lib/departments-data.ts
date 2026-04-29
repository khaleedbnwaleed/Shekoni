import { Stethoscope, Heart, Brain, Eye, Bone, Zap, Users, Microscope, Wind, Shield, AlertCircle, Home, Activity, Scissors } from 'lucide-react';

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  description_ha: string;
  icon: any;
  color: string;
  services: string[];
  services_ha: string[];
  doctors: number;
  beds: number;
  availability: string;
}

export const departments: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    slug: 'cardiology',
    description: 'Specialized care for heart and cardiovascular diseases. Our cardiology department provides diagnostic and therapeutic services including ECG, echocardiography, stress testing, and cardiac catheterization.',
    description_ha: 'Kulawa ta musamman ga jiya da cututtuka na jiyya. Sataunin cardiologia yana ba da sabis na gane cututtuka da treataka gaba da ECG, echocardiography, stress testing, da cardiac catheterization.',
    icon: Heart,
    color: 'from-red-500 to-red-600',
    services: ['ECG', 'Echocardiography', 'Stress Testing', 'Cardiac Catheterization', 'Heart Consultation'],
    services_ha: ['ECG', 'Echocardiography', 'Stress Testing', 'Catheterization', 'Ganawa ta Jiya'],
    doctors: 12,
    beds: 25,
    availability: '24/7'
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology',
    slug: 'gastroenterology',
    description: 'Expert treatment of digestive system diseases including stomach, intestines, liver, and pancreas disorders. Services include endoscopy, colonoscopy, and digestive disorder management.',
    description_ha: 'Jiya na cututtukan tsarin fiture ciki da adora, jiya, jinin hanta. Sabis sun haɗa da endoscopy, colonoscopy, da gudanarwa na cututtukan fiture.',
    icon: Stethoscope,
    color: 'from-amber-500 to-amber-600',
    services: ['Endoscopy', 'Colonoscopy', 'Ulcer Treatment', 'Liver Disease Management', 'Pancreas Consultation'],
    services_ha: ['Endoscopy', 'Colonoscopy', 'Jiya na Ulcer', 'Jinna jinin Hanta', 'Ganawa'],
    doctors: 8,
    beds: 20,
    availability: '8AM-6PM'
  },
  {
    id: 'nephrology',
    name: 'Nephrology',
    slug: 'nephrology',
    description: 'Comprehensive care for kidney and urinary system disorders. We provide dialysis, kidney transplant coordination, and management of chronic kidney disease.',
    description_ha: 'Kulawa mai ɗauke ga cututtukan jini da tsarin fiska. Mun ba da dialysis, daidaitawa na damje jini, da gudanarwa na jiya jini na ajiya.',
    icon: Zap,
    color: 'from-blue-500 to-blue-600',
    services: ['Dialysis', 'Kidney Function Testing', 'Transplant Coordination', 'CKD Management', 'Nephrology Consultation'],
    services_ha: ['Dialysis', 'Bincike Aiki Jini', 'Daidaitawa', 'CKD Gudanarwa', 'Ganawa'],
    doctors: 6,
    beds: 18,
    availability: '24/7'
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    slug: 'dermatology',
    description: 'Skin disease diagnosis and treatment. Our dermatology specialists handle acne, eczema, psoriasis, skin infections, and cosmetic dermatology.',
    description_ha: 'Gane da jiya na cututtukan jiki. Kakakinmu suna jiyar acne, eczema, psoriasis, kaini kaini, da kayan aje.',
    icon: Shield,
    color: 'from-pink-500 to-pink-600',
    services: ['Skin Consultation', 'Acne Treatment', 'Eczema Management', 'Psoriasis Treatment', 'Skin Biopsy'],
    services_ha: ['Ganawa Jiki', 'Jiya acne', 'Jiya eczema', 'Jiya psoriasis', 'Biopsy'],
    doctors: 5,
    beds: 10,
    availability: '8AM-5PM'
  },
  {
    id: 'hematology',
    name: 'Hematology',
    slug: 'hematology',
    description: 'Specialized treatment for blood disorders and cancers. Services include blood transfusions, leukemia treatment, and anemia management.',
    description_ha: 'Kulawa ta musamman na cututtukan jini da kansa. Sabis suna haɗa da buɗe jini, jiya kansa jini, da gudanarwa.',
    icon: Microscope,
    color: 'from-purple-500 to-purple-600',
    services: ['Blood Transfusion', 'Leukemia Treatment', 'Anemia Management', 'Lymphoma Care', 'Blood Testing'],
    services_ha: ['Buɗe Jini', 'Jiya Leukemia', 'Jiya Anemia', 'Aiki Lymphoma', 'Bincike'],
    doctors: 7,
    beds: 22,
    availability: '24/7'
  },
  {
    id: 'endocrinology',
    name: 'Endocrinology',
    slug: 'endocrinology',
    description: 'Expert care for hormone and metabolic disorders. We specialize in diabetes management, thyroid disease, and hormonal imbalances.',
    description_ha: 'Kulawa ta kakakinmu game da cikakken cututtuka. Mun ɗ jiya sukar jini, cututtukan thyroid, da rashin daidaito na hormones.',
    icon: Zap,
    color: 'from-yellow-500 to-yellow-600',
    services: ['Diabetes Management', 'Thyroid Treatment', 'Hormone Testing', 'Obesity Consultation', 'Metabolic Disorder Care'],
    services_ha: ['Jiya Sukar', 'Jiya Thyroid', 'Bincike Hormones', 'Ganawa', 'Jiya'],
    doctors: 6,
    beds: 15,
    availability: '8AM-6PM'
  },
  {
    id: 'geriatrics',
    name: 'Geriatrics',
    slug: 'geriatrics',
    description: 'Specialized healthcare for elderly patients. We provide comprehensive geriatric care, fall prevention, and age-related disease management.',
    description_ha: 'Kulawa ta musamman ga tsofaffin mutane. Mun ba da kulawa mai ɗauke, rigakafin faɗi, da jiya na cututtukan ruwa.',
    icon: Users,
    color: 'from-gray-500 to-gray-600',
    services: ['Elderly Care', 'Fall Prevention', 'Dementia Support', 'Bedsore Management', 'Geriatric Consultation'],
    services_ha: ['Aiki Tsofaffin', 'Rigakafin Faɗi', 'Damje Dementia', 'Jiya Bedsore', 'Ganawa'],
    doctors: 5,
    beds: 20,
    availability: '24/7'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    slug: 'neurology',
    description: 'Comprehensive neurological care for brain and nerve disorders. Services include stroke management, epilepsy treatment, and headache management.',
    description_ha: 'Kulawa mai luɗa ga cututtukan jiya da nervoji. Sabis suna haɗa da jiya stroke, epilepsy, da gudanarwa mai baki.',
    icon: Brain,
    color: 'from-indigo-500 to-indigo-600',
    services: ['Stroke Management', 'Epilepsy Treatment', 'Migraine Treatment', 'Parkinson Care', 'Neurological Testing'],
    services_ha: ['Jiya Stroke', 'Jiya Epilepsy', 'Jiya Migraine', 'Aiki Parkinson', 'Bincike'],
    doctors: 9,
    beds: 24,
    availability: '24/7'
  },
  {
    id: 'pulmonology',
    name: 'Pulmonology',
    slug: 'pulmonology',
    description: 'Expert care for respiratory diseases. We treat asthma, chronic bronchitis, lung cancer, and tuberculosis with advanced diagnostic tools.',
    description_ha: 'Kulawa ta kakakinmu game da cututtukan numfashi. Mun jiya asthma, bronchitis, kansa pulmoni, da tuberculosis.',
    icon: Wind,
    color: 'from-cyan-500 to-cyan-600',
    services: ['Asthma Management', 'COPD Treatment', 'TB Treatment', 'Lung Function Testing', 'Respiratory Consultation'],
    services_ha: ['Jiya Asthma', 'Jiya COPD', 'Jiya TB', 'Bincike Pulmoni', 'Ganawa'],
    doctors: 8,
    beds: 20,
    availability: '24/7'
  },
  {
    id: 'infectious-diseases',
    name: 'Infectious Diseases',
    slug: 'infectious-diseases',
    description: 'Advanced treatment of infections and communicable diseases. Services include HIV/AIDS care, hepatitis treatment, and antimicrobial therapy.',
    description_ha: 'Jiya ta kakakinmu na kaini. Sabis suna haɗa da aiki HIV/AIDS, jiya hepatitis, da maganin kaini.',
    icon: AlertCircle,
    color: 'from-orange-500 to-orange-600',
    services: ['HIV/AIDS Treatment', 'Hepatitis Management', 'Antibiotic Therapy', 'Infection Control', 'Disease Consultation'],
    services_ha: ['Jiya HIV/AIDS', 'Jiya Hepatitis', 'Antibiotic Therapy', 'Rigakafin Kaini', 'Ganawa'],
    doctors: 7,
    beds: 18,
    availability: '24/7'
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry',
    slug: 'psychiatry',
    description: 'Comprehensive mental health services. We provide psychotherapy, medication management, and crisis intervention for depression, anxiety, and other psychiatric disorders.',
    description_ha: 'Sabis na lafiya ta hankali. Mun ba da psychotherapy, juye magani, da ajiye ta kwakwalwa.',
    icon: Brain,
    color: 'from-violet-500 to-violet-600',
    services: ['Psychotherapy', 'Depression Treatment', 'Anxiety Management', 'Crisis Intervention', 'Psychiatric Consultation'],
    services_ha: ['Psychotherapy', 'Jiya Depression', 'Jiya Anxiety', 'Ajiye Kwakwalwa', 'Ganawa'],
    doctors: 8,
    beds: 20,
    availability: '8AM-8PM'
  },
  {
    id: 'family-medicine',
    name: 'Family Medicine',
    slug: 'family-medicine',
    description: 'Primary healthcare for the entire family. We provide preventive care, chronic disease management, and comprehensive family health services.',
    description_ha: 'Aiki lafiya na gida. Mun ba da rigakafin cututtuka, jiya na ajiya cututtuka, da sabis na cikakken gida.',
    icon: Home,
    color: 'from-green-500 to-green-600',
    services: ['Family Consultation', 'Preventive Care', 'Chronic Disease Management', 'Vaccination', 'Health Screening'],
    services_ha: ['Ganawa Gida', 'Rigakafin', 'Jiya Cututtuka', 'Alluran Gani', 'Bincike Lafiya'],
    doctors: 10,
    beds: 15,
    availability: '8AM-6PM'
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology',
    slug: 'ophthalmology',
    description: 'Specialized eye care services. We provide eye examinations, cataract surgery, refractive error correction, and glaucoma treatment.',
    description_ha: 'Kulawa ta musamman ga idanu. Mun ba da bincike idanu, wayo kamarsu, gyara kallo, da jiya glaucoma.',
    icon: Eye,
    color: 'from-teal-500 to-teal-600',
    services: ['Eye Examination', 'Cataract Surgery', 'Refractive Correction', 'Glaucoma Treatment', 'Retina Consultation'],
    services_ha: ['Bincike Idanu', 'Wayo Kamarsu', 'Gyara Kallo', 'Jiya Glaucoma', 'Ganawa'],
    doctors: 6,
    beds: 12,
    availability: '8AM-5PM'
  },
  {
    id: 'general-surgery',
    name: 'General Surgery',
    slug: 'general-surgery',
    description: 'Advanced surgical services for general conditions. We perform appendectomy, hernia repair, trauma surgery, and other general surgical procedures.',
    description_ha: 'Sabis na kasuwa. Mun rayar appendectomy, gyara hernia, kasuwa da sauran aiki kasuwa.',
    icon: Scissors,
    color: 'from-red-500 to-red-600',
    services: ['Appendectomy', 'Hernia Repair', 'Trauma Surgery', 'Gastrointestinal Surgery', 'Pre-operative Consultation'],
    services_ha: ['Appendectomy', 'Gyara Hernia', 'Kasuwa Kaini', 'Kasuwa Fiture', 'Ganawa Kafin'],
    doctors: 12,
    beds: 30,
    availability: '24/7'
  },
  {
    id: 'cardiothoracic-surgery',
    name: 'Cardiothoracic Surgery',
    slug: 'cardiothoracic-surgery',
    description: 'Specialized surgical care for heart and chest conditions. We perform heart transplants, bypass surgery, and thoracic procedures.',
    description_ha: 'Kulawa ta musamman na kasuwa jiya da ƙirji. Mun rayar damje jiya, bypass surgery, da sauran aiki.',
    icon: Heart,
    color: 'from-red-600 to-red-700',
    services: ['Bypass Surgery', 'Heart Transplant', 'Valve Replacement', 'Thoracic Surgery', 'Cardiac Surgery Consultation'],
    services_ha: ['Surgery Bypass', 'Damje Jiya', 'Gyara Valve', 'Kasuwa Ƙirji', 'Ganawa Kafin'],
    doctors: 8,
    beds: 20,
    availability: '24/7'
  },
  {
    id: 'neurosurgery',
    name: 'Neurosurgery',
    slug: 'neurosurgery',
    description: 'Expert neurosurgical services for brain and spinal cord conditions. We treat brain tumors, spinal disorders, and neurological emergencies.',
    description_ha: 'Sabis na kasuwa jiya da shin da jiya. Mun jiya kansa jiya, cututtukan shin, da hadarin jiya.',
    icon: Brain,
    color: 'from-indigo-600 to-indigo-700',
    services: ['Brain Tumor Surgery', 'Spinal Surgery', 'Aneurysm Treatment', 'Trauma Surgery', 'Neurosurgery Consultation'],
    services_ha: ['Kasuwa Kansa', 'Kasuwa Shin', 'Jiya Aneurysm', 'Kasuwa Kaini', 'Ganawa Kafin'],
    doctors: 6,
    beds: 18,
    availability: '24/7'
  }
];

export function getDepartmentBySlug(slug: string): Department | undefined {
  return departments.find(dept => dept.slug === slug);
}

export function getAllDepartmentSlugs(): string[] {
  return departments.map(dept => dept.slug);
}