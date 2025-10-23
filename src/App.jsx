import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, Download, RefreshCw, Shield, Zap, Globe, Home, Calculator, FileCheck, Users, BookOpen, Mail, Menu, X, ChevronRight, Star, TrendingUp, Award, Clock } from 'lucide-react';

// --- CPF Logic and Utility Functions (Unchanged) ---
const formatCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const regionCodes = {
  all: null, rs: 0, df: 1, am: 2, mg: 3, pe: 4, ba: 5, ce: 6, rj: 7, sp: 8, pr: 9
};

const generateCPFUtil = (region, format) => {
  let cpf = [];
  const regionCode = regionCodes[region];

  for (let i = 0; i < 9; i++) {
    if (i === 8 && regionCode !== null) {
      cpf.push(regionCode);
    } else {
      cpf.push(Math.floor(Math.random() * 10));
    }
  }

  // Calculate first check digit
  let sum1 = 0;
  for (let i = 0; i < 9; i++) {
    sum1 += cpf[i] * (10 - i);
  }
  let remainder1 = sum1 % 11;
  let checkDigit1 = remainder1 < 2 ? 0 : 11 - remainder1;
  cpf.push(checkDigit1);

  // Calculate second check digit
  let sum2 = 0;
  for (let i = 0; i < 10; i++) {
    sum2 += cpf[i] * (11 - i);
  }
  let remainder2 = sum2 % 11;
  let checkDigit2 = remainder2 < 2 ? 0 : 11 - remainder2;
  cpf.push(checkDigit2);

  const rawCPF = cpf.join('');
  return format === 'formatted' ? formatCPF(rawCPF) : rawCPF;
};

const validateCPFUtil = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validate first digit
  let sum1 = 0;
  for (let i = 0; i < 9; i++) {
    sum1 += parseInt(cpf[i]) * (10 - i);
  }
  let remainder1 = sum1 % 11;
  let checkDigit1 = remainder1 < 2 ? 0 : 11 - remainder1;
  if (checkDigit1 !== parseInt(cpf[9])) return false;

  // Validate second digit
  let sum2 = 0;
  for (let i = 0; i < 10; i++) {
    sum2 += parseInt(cpf[i]) * (11 - i);
  }
  let remainder2 = sum2 % 11;
  let checkDigit2 = remainder2 < 2 ? 0 : 11 - remainder2;
  return checkDigit2 === parseInt(cpf[10]);
};
// --- End CPF Logic ---


const CPFValidatorGenerator = () => {
  const [language, setLanguage] = useState('pt');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cpfInput, setCpfInput] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [generatedCPF, setGeneratedCPF] = useState('');
  const [batchCount, setBatchCount] = useState(10);
  const [batchCPFs, setBatchCPFs] = useState([]);
  const [region, setRegion] = useState('all');
  const [format, setFormat] = useState('formatted');
  const [copied, setCopied] = useState(false);
  const [batchValidationResults, setBatchValidationResults] = useState([]);
  const [batchSubPage, setBatchSubPage] = useState('generator');

  // --- HISTORY ROUTING LOGIC (Using native History API for clean URLs) ---
  const getCurrentPath = useCallback(() => {
    // Gets path like '/gerador-cpf' or '/'
    return window.location.pathname.toLowerCase() || '/';
  }, []);

  const [currentCleanPath, setCurrentCleanPath] = useState(getCurrentPath());

  const navigate = useCallback((path) => {
    // If the path is just a placeholder (like '/en' for language switch), avoid pushState in a real app
    // For this context, we'll navigate directly.
    window.history.pushState(null, '', path);
    setCurrentCleanPath(path);
    window.scrollTo(0, 0); // Scroll to top on navigation
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentCleanPath(getCurrentPath());
      window.scrollTo(0, 0); // Scroll to top on navigation
    };

    window.addEventListener('popstate', handlePopState);
    
    // Initial load check
    if (window.location.hash) {
      // If the user loads an old hash URL (e.g., /#/gerador), transition them to the clean URL and remove the hash
      const cleanPath = window.location.hash.substring(1).toLowerCase() || '/';
      window.history.replaceState(null, '', cleanPath);
      setCurrentCleanPath(cleanPath);
    } else {
      // Ensure current state is accurately reflected on load if no hash was present
      setCurrentCleanPath(getCurrentPath());
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [getCurrentPath]);

  const getPageIdFromPath = (path) => {
    // Determine the page ID from the path segments
    const pathSegment = path.split('/').filter(Boolean)[0];
    
    if (path === '/') return 'home';
    if (pathSegment === 'gerador-cpf') return 'generator';
    if (pathSegment === 'validar-cpf') return 'validator';
    if (pathSegment === 'lote-cpf') return 'batch';
    if (pathSegment === 'sobre-cpf-tools') return 'about';
    if (pathSegment === 'contato') return 'contact';
    if (pathSegment === 'politica-privacidade') return 'privacy';
    if (pathSegment === 'termos-de-uso') return 'terms';
    if (pathSegment === 'aviso-legal') return 'legal';
    return 'home';
  };

  const currentPageId = getPageIdFromPath(currentCleanPath);
  // --- END HISTORY ROUTING LOGIC ---


  const translations = {
    pt: {
      home: 'Início',
      generator: 'Gerador de CPF',
      validator: 'Validar CPF',
      batchTools: 'Lote CPF',
      about: 'Sobre CPF Tools',
      contact: 'Contato',
      privacy: 'Política de Privacidade', 
      terms: 'Termos de Uso', 
      legal: 'Aviso Legal', 

      // --- SEO OPTIMIZED CONTENT PT ---
      heroTitle: 'Gerador de CPF Válido e Validador de CPF Online',
      heroSubtitle: 'A solução completa e gratuita para gerar CPFs válidos para testes e validar números existentes.',
      heroDescription: 'Gere **CPFs válidos** para testes de desenvolvimento, valide números existentes instantaneamente e processe milhares de documentos em segundos. Ferramenta 100% gratuita, segura e confiável.',
      getStarted: 'Começar Agora',
      learnMore: 'Saiba Mais',
      
      generatorTitle: 'Gerador de CPF Válido | CPF Gerador para Testes',
      generatorMetaDesc: 'Use nosso **gerador de cpf** para criar números **CPF válido** para testes. Escolha a região brasileira, formato e gere múltiplos CPFs para desenvolvimento de sistemas. Ferramenta online e gratuita.',
      generatorIntro: 'Nosso **Gerador de CPF Válido** utiliza o algoritmo oficial brasileiro para criar números de CPF matematicamente válidos. Ideal para desenvolvedores que precisam testar sistemas, formulários e validações. Gere seu **cpf gerador** agora!',
      whyUseGenerator: 'Por que usar nosso Gerador de CPF?',

      validatorTitle: 'Validador de CPF Online | Verificar se o CPF é Válido',
      validatorMetaDesc: 'Use nosso **validador de cpf** online e gratuito para verificar se o **CPF é válido** instantaneamente. Ferramenta rápida, segura e baseada no algoritmo oficial da Receita Federal.',
      validatorIntro: 'Verifique se um número de **CPF é válido** usando o algoritmo matemático oficial. Nossa ferramenta analisa os dígitos verificadores e confirma a integridade do número instantaneamente.',
      whyUseValidator: 'Por que usar nosso Validador de CPF?',
      
      batchToolsTitle: 'Lote CPF (Gerador e Validador de CPF em Massa)',
      batchToolsMetaDesc: 'Processe milhares de CPFs de uma vez. Gere ou valide em lote com exportação em CSV/JSON. Perfeito para desenvolvedores e analistas de dados.',
      // --- END SEO OPTIMIZED CONTENT PT ---

      stats: {
        validations: 'Validações Realizadas',
        generated: 'CPFs Gerados',
        users: 'Usuários Ativos',
        uptime: 'Disponibilidade'
      },
      features: 'Recursos Principais',
      instantValidation: 'Validação Instantânea',
      instantDesc: 'Algoritmo matemático verificado em milissegundos com 100% de precisão',
      batchProcessing: 'Processamento em Lote',
      batchDesc: 'Gere ou valide até 1.000 CPFs de uma vez com exportação em CSV/JSON',
      regionalGen: 'Geração Regional',
      regionalDesc: 'CPFs específicos por estado brasileiro seguindo padrões oficiais',
      offlineReady: 'Funciona Offline',
      offlineDesc: 'PWA instalável para uso sem internet em qualquer dispositivo',
      securePrivate: 'Seguro e Privado',
      secureDesc: 'Processamento 100% local, seus dados nunca saem do seu navegador',
      freeForever: 'Gratuito para Sempre',
      freeDesc: 'Sem limitações, sem registro, sem custos ocultos',
      howItWorks: 'Como Funciona',
      step1Title: 'Escolha sua Ferramenta',
      step1Desc: 'Selecione entre gerador, validador ou processamento em lote',
      step2Title: 'Configure suas Opções',
      step2Desc: 'Defina região, formato e quantidade conforme necessário',
      step3Title: 'Obtenha Resultados',
      step3Desc: 'Receba CPFs válidos ou resultados de validação instantaneamente',
      useCases: 'Casos de Uso',
      useCase1: 'Testes de Desenvolvimento',
      useCase1Desc: 'Gere dados fictícios para testar formulários e sistemas',
      useCase2: 'Validação de Dados',
      useCase2Desc: 'Verifique a integridade de bases de dados de CPF',
      useCase3: 'Auditoria Massiva',
      useCase3Desc: 'Processe milhares de CPFs em segundos',
      useCase4: 'Educação e Treinamento',
      useCase4Desc: 'Ensine sobre o algoritmo de validação de CPF',
      generateCPF: 'Gerar CPF',
      validateCPF: 'Validar CPF',
      aboutTitle: 'Sobre o Validador e Gerador de CPF',
      aboutMetaDesc: 'Conheça a ferramenta de validação e geração de CPF mais completa do Brasil. Algoritmo matemático oficial, processamento local e 100% gratuito.',
      ourMission: 'Nossa Missão',
      missionText: 'Fornecer ferramentas gratuitas, precisas e acessíveis para validação e geração de CPF, auxiliando desenvolvedores, empresas e cidadãos brasileiros em suas necessidades diárias.',
      cpfAlgorithm: 'O Algoritmo do CPF',
      algorithmText: 'O CPF (Cadastro de Pessoas Físicas) utiliza um algoritmo matemático de verificação baseado em módulo 11. Os dois últimos dígitos são dígitos verificadores calculados a partir dos nove primeiros números, garantindo a integridade do documento.',
      algorithm1: 'Os 9 primeiros dígitos são números aleatórios (com o 9º indicando a região)',
      algorithm2: 'O 10º dígito é calculado multiplicando cada um dos 9 primeiros por pesos de 10 a 2',
      algorithm3: 'O 11º dígito é calculado multiplicando os 10 primeiros por pesos de 11 a 2',
      algorithm4: 'Ambos usam módulo 11 para determinar o dígito verificador final',
      contactTitle: 'Entre em Contato',
      contactMetaDesc: 'Tem dúvidas sobre nossa ferramenta de CPF? Entre em contato conosco para suporte, sugestões ou parcerias.',
      contactIntro: 'Estamos aqui para ajudar! Se você tem dúvidas, sugestões ou encontrou algum problema, ficaremos felizes em ouvir de você.',
      quantity: 'Quantidade',
      region: 'Região',
      allRegions: 'Todas as Regiões',
      formatOption: 'Formato',
      formatted: 'Formatado (xxx.xxx.xxx-xx)',
      unformatted: 'Sem Formatação (xxxxxxxxxxx)',
      copy: 'Copiar',
      copied: 'Copiado!',
      exportCSV: 'Exportar CSV',
      exportJSON: 'Exportar JSON',
      valid: 'CPF Válido',
      invalid: 'CPF Inválido',
      generate: 'Gerar',
      validate: 'Validar',
      enterCPF: 'Digite ou cole o CPF para validar',
      pasteList: 'Cole uma lista de CPFs (um por linha)',
      validateBatch: 'Validar Lote',
      results: 'Resultados',
      footerAbout: 'Sobre',
      footerAboutText: 'Ferramenta profissional e gratuita para validação e geração de CPF usando algoritmo matemático oficial.',
      footerTools: 'Ferramentas',
      footerResources: 'Recursos',
      documentation: 'Documentação',
      api: 'API',
      blog: 'Blog',
      faq: 'FAQ',
      rights: 'Todos os direitos reservados',
      disclaimer: 'Aviso Legal',
      disclaimerText: 'Esta ferramenta gera CPFs matematicamente válidos apenas para fins de teste e desenvolvimento. Não utilize para fraude ou atividades ilegais. Os CPFs gerados são fictícios e não representam pessoas reais.',
      states: {
        all: 'Todas as Regiões',
        rs: 'Rio Grande do Sul (0)',
        df: 'DF, GO, MS, MT, TO (1)',
        sp: 'São Paulo (8)',
        rj: 'Rio de Janeiro, ES (7)',
        mg: 'Minas Gerais (3)',
        pr: 'Paraná, SC (9)',
        ba: 'Bahia, Sergipe (5)',
        pe: 'Pernambuco, AL, PB, RN (4)',
        ce: 'Ceará, MA, PI (6)',
        am: 'Amazonas, AC, AP, PA, RO, RR (2)'
      },
      // New Legal Content PT
      privacyText: 'A sua privacidade é a nossa prioridade. O CPF Tools não coleta, armazena ou transmite qualquer CPF inserido ou gerado. Todo o processamento, incluindo validação e geração, é realizado 100% no seu navegador (cliente-side), garantindo que seus dados permaneçam privados e seguros. Utilizamos o Google AdSense para financiamento e Google Analytics para métricas anônimas de uso.',
      termsText: 'Ao utilizar o CPF Tools, você concorda que a ferramenta é fornecida "como está" (AS IS), sem garantias. É estritamente proibido o uso da ferramenta para qualquer finalidade ilegal, fraudulenta ou que viole as leis brasileiras. Os CPFs gerados são fictícios e destinados exclusivamente a testes de software e desenvolvimento.',
      legalText: 'AVISO: Os números de CPF gerados por esta ferramenta são matematicamente válidos, mas não correspondem a pessoas físicas reais. Eles servem unicamente como dados fictícios para fins de testes e desenvolvimento de sistemas. Qualquer tentativa de usar os CPFs gerados para fraudes, golpes ou atividades ilícitas é de total responsabilidade do usuário, e a plataforma CPF Tools se isenta de qualquer responsabilidade legal por mau uso.'
    },
    en: {
      home: 'Home',
      generator: 'CPF Generator',
      validator: 'Validate CPF',
      batchTools: 'Batch CPF',
      about: 'About CPF Tools',
      contact: 'Contact',
      privacy: 'Privacy Policy', // New
      terms: 'Terms of Use', // New
      legal: 'Legal Notice', // New
      
      // ... (rest of existing translations)
      heroTitle: 'Professional CPF Validator & Generator',
      heroSubtitle: 'Complete solution for CPF validation and generation with certified mathematical algorithm',
      heroDescription: 'Generate valid CPFs for development testing, validate existing numbers instantly, and process thousands of documents in seconds. 100% free, secure, and reliable tool.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      stats: {
        validations: 'Validations Performed',
        generated: 'CPFs Generated',
        users: 'Active Users',
        uptime: 'Uptime'
      },
      features: 'Key Features',
      instantValidation: 'Instant Validation',
      instantDesc: 'Mathematical algorithm verified in milliseconds with 100% accuracy',
      batchProcessing: 'Batch Processing',
      batchDesc: 'Generate or validate up to 1,000 CPFs at once with CSV/JSON export',
      regionalGen: 'Regional Generation',
      regionalDesc: 'State-specific CPFs following official Brazilian standards',
      offlineReady: 'Offline Ready',
      offlineDesc: 'Installable PWA for use without internet on any device',
      securePrivate: 'Secure & Private',
      secureDesc: '100% local processing, your data never leaves your browser',
      freeForever: 'Free Forever',
      freeDesc: 'No limitations, no registration, no hidden costs',
      howItWorks: 'How It Works',
      step1Title: 'Choose Your Tool',
      step1Desc: 'Select between generator, validator or batch processing',
      step2Title: 'Configure Options',
      step2Desc: 'Set region, format and quantity as needed',
      step3Title: 'Obtain Results',
      step3Desc: 'Receive valid CPFs or validation results instantly',
      useCases: 'Use Cases',
      useCase1: 'Development Testing',
      useCase1Desc: 'Generate dummy data to test forms and systems',
      useCase2: 'Data Validation',
      useCase2Desc: 'Verify integrity of CPF databases',
      useCase3: 'Mass Auditing',
      useCase3Desc: 'Process thousands of CPFs in seconds',
      useCase4: 'Education & Training',
      useCase4Desc: 'Teach about CPF validation algorithm',
      generateCPF: 'Generate CPF',
      generatorTitle: 'CPF Generator - Create Valid CPFs Instantly',
      generatorMetaDesc: 'Generate mathematically valid CPFs with our free online generator. Choose Brazilian region, format and generate multiple CPFs for development testing.',
      generatorIntro: 'Our CPF generator uses the official Brazilian algorithm to create mathematically valid CPF numbers. Ideal for developers who need to test systems, forms and validations.',
      whyUseGenerator: 'Why use our Generator?',
      validateCPF: 'Validate CPF',
      validatorTitle: 'CPF Validator - Verify CPFs Instantly',
      validatorMetaDesc: 'Validate CPFs online for free with our validator that uses the official mathematical algorithm. Verify the authenticity of any CPF in milliseconds.',
      validatorIntro: 'Check if a CPF number is valid using the official mathematical algorithm. Our tool analyzes the check digits and confirms the number integrity instantly.',
      whyUseValidator: 'Why use our Validator?',
      batchToolsTitle: 'Batch Tools',
      batchToolsMetaDesc: 'Process thousands of CPFs at once. Generate or validate in batch with CSV/JSON export. Perfect for developers and data analysts.',
      batchGenTitle: 'Batch Generation',
      batchGenIntro: 'Generate hundreds or thousands of valid CPFs simultaneously. Perfect for populating test databases, creating datasets or performing load tests on systems.',
      batchValTitle: 'Batch Validation',
      batchValIntro: 'Validate large lists of CPFs at once. Paste a list, load a file or import data to verify the validity of thousands of CPFs instantly.',
      aboutTitle: 'About CPF Validator',
      aboutMetaDesc: 'Know the most complete CPF validation and generation tool in Brazil. Official mathematical algorithm, local processing and 100% free.',
      ourMission: 'Our Mission',
      missionText: 'Provide free, accurate and accessible tools for CPF validation and generation, helping Brazilian developers, companies and citizens in their daily needs.',
      cpfAlgorithm: 'The CPF Algorithm',
      algorithmText: 'The CPF (Individual Taxpayer Registry) uses a mathematical verification algorithm based on modulo 11. The last two digits are check digits calculated from the first nine numbers, ensuring document integrity.',
      algorithm1: 'The first 9 digits are random numbers (with the 9th indicating the region)',
      algorithm2: 'The 10th digit is calculated by multiplying each of the first 9 by weights from 10 to 2',
      algorithm3: 'The 11th digit is calculated by multiplying the first 10 by weights from 11 to 2',
      algorithm4: 'Both use modulo 11 to determine the final check digit',
      contactTitle: 'Contact Us',
      contactMetaDesc: 'Have questions about our CPF tool? Contact us for support, suggestions or partnerships.',
      contactIntro: 'We are here to help! If you have questions, suggestions or found a problem, we will be happy to hear from you.',
      quantity: 'Quantity',
      region: 'Region',
      allRegions: 'All Regions',
      formatOption: 'Format',
      formatted: 'Formatted (xxx.xxx.xxx-xx)',
      unformatted: 'Unformatted (xxxxxxxxxxx)',
      copy: 'Copy',
      copied: 'Copied!',
      exportCSV: 'Export CSV',
      exportJSON: 'Export JSON',
      valid: 'Valid CPF',
      invalid: 'Invalid CPF',
      generate: 'Generate',
      validate: 'Validate',
      enterCPF: 'Enter or paste CPF to validate',
      pasteList: 'Paste a list of CPFs (one per line)',
      validateBatch: 'Validate Batch',
      results: 'Results',
      footerAbout: 'About',
      footerAboutText: 'Professional and free tool for CPF validation and generation using official mathematical algorithm.',
      footerTools: 'Tools',
      footerResources: 'Resources',
      documentation: 'Documentation',
      api: 'API',
      blog: 'Blog',
      faq: 'FAQ',
      rights: 'All rights reserved',
      disclaimer: 'Legal Notice',
      disclaimerText: 'This tool generates mathematically valid CPFs only for testing and development purposes. Do not use for fraud or illegal activities. Generated CPFs are fictitious and do not represent real people.',
      states: {
        all: 'All Regions',
        rs: 'Rio Grande do Sul (0)',
        df: 'Federal District, GO, MS, MT, TO (1)',
        sp: 'São Paulo (8)',
        rj: 'Rio de Janeiro, ES (7)',
        mg: 'Minas Gerais (3)',
        pr: 'Paraná, SC (9)',
        ba: 'Bahia, Sergipe (5)',
        pe: 'Pernambuco, AL, PB, RN (4)',
        ce: 'Ceará, MA, PI (6)',
        am: 'Amazonas, AC, AP, PA, RO, RR (2)'
      },
      // New Legal Content EN
      privacyText: 'Your privacy is our priority. CPF Tools does not collect, store, or transmit any entered or generated CPF. All processing, including validation and generation, is performed 100% in your browser (client-side), ensuring your data remains private and secure. We use Google AdSense for funding and Google Analytics for anonymous usage metrics.',
      termsText: 'By using CPF Tools, you agree that the tool is provided "AS IS," without warranties. It is strictly forbidden to use the tool for any illegal, fraudulent purpose, or any activity that violates Brazilian laws. Generated CPFs are fictitious and intended solely for software testing and development.',
      legalText: 'NOTICE: The CPF numbers generated by this tool are mathematically valid but do not correspond to real individuals. They serve only as fictitious data for system testing and development purposes. Any attempt to use the generated CPFs for fraud, scams, or illicit activities is the user\'s sole responsibility, and the CPF Tools platform disclaims all legal liability for misuse.'
    }
  };

  const t = translations[language];

  // --- Handlers for tool interaction (Updated to use utilities) ---
  const handleGenerate = () => {
    setGeneratedCPF(generateCPFUtil(region, format));
  };

  const handleBatchGenerate = () => {
    const cpfs = [];
    const count = Math.min(batchCount, 1000);
    for (let i = 0; i < count; i++) {
      cpfs.push(generateCPFUtil(region, format));
    }
    setBatchCPFs(cpfs);
  };

  const handleValidate = () => {
    const isValid = validateCPFUtil(cpfInput);
    setValidationResult(isValid);
  };

  const handleBatchValidate = (text) => {
    const cpfs = text.split(/[\n,]/).map(line => line.replace(/[^\d]/g, '')).filter(line => line.trim() && line.length === 11);
    const results = cpfs.map(cpf => ({
      cpf: formatCPF(cpf),
      valid: validateCPFUtil(cpf)
    }));
    setBatchValidationResults(results);
  };

  const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportToCSV = (data, filename = 'cpfs.csv') => {
    const csv = data.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = (data, filename = 'cpfs.json') => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };


  // --- SEO Meta Tags Logic (Using History API Path) ---
  const getPageMeta = () => {
    // We use the full path for accurate lookup
    const path = currentCleanPath;
    
    // Map paths to keywords
    let pageKey;
    if (path === '/') pageKey = 'home';
    else if (path.startsWith('/gerador-cpf')) pageKey = 'gerador-cpf';
    else if (path.startsWith('/validar-cpf')) pageKey = 'validar-cpf';
    else if (path.startsWith('/lote-cpf')) pageKey = 'lote-cpf';
    else if (path.startsWith('/sobre-cpf-tools')) pageKey = 'sobre-cpf-tools';
    else if (path.startsWith('/contato')) pageKey = 'contato';
    else if (path.startsWith('/politica-privacidade')) pageKey = 'privacidade';
    else if (path.startsWith('/termos-de-uso')) pageKey = 'termos';
    else if (path.startsWith('/aviso-legal')) pageKey = 'aviso-legal';
    else pageKey = 'home';


    const meta = {
      home: {
        // Optimized for: gerador de cpf, gerador cpf
        title: language === 'pt' ? 'Gerador de CPF Válido e Validador de CPF Online - Gratuito' : 'Professional CPF Validator & Generator - Free Online',
        description: t.heroDescription,
        keywords: language === 'pt' ? 'gerador de cpf, gerador cpf, cpf gerador, cpf válido, validar cpf online, gerar cpf válido' : 'cpf validator, cpf generator, valid cpf, validate cpf online, generate valid cpf'
      },
      'gerador-cpf': {
        // Optimized for: gerador cpf valido, gerador de cpf valido, cpf gerador valido, cpf valido gerador
        title: t.generatorTitle,
        description: t.generatorMetaDesc,
        keywords: language === 'pt' ? 'gerador cpf valido, gerador de cpf valido, cpf gerador valido, cpf valido gerador, cpf para teste, cpf fictício' : 'cpf generator, generate valid cpf, test cpf, fictitious cpf'
      },
      'validar-cpf': {
        // Optimized for: validador cpf, verificar se cpf é válido
        title: t.validatorTitle,
        description: t.validatorMetaDesc,
        keywords: language === 'pt' ? 'validador cpf, validar cpf, verificar cpf, cpf válido, verificar se o cpf é válido' : 'cpf validator, validate cpf, verify cpf, valid cpf'
      },
      'lote-cpf': {
        title: t.batchToolsTitle,
        description: t.batchToolsMetaDesc,
        keywords: language === 'pt' ? 'validação em lote, geração em lote cpf, processar cpfs, gerador cpf em massa' : 'batch validation, batch cpf generation, process cpfs'
      },
      'sobre-cpf-tools': {
        title: t.aboutTitle,
        description: t.aboutMetaDesc,
        keywords: language === 'pt' ? 'sobre validador cpf, algoritmo cpf, como funciona cpf' : 'about cpf validator, cpf algorithm, how cpf works'
      },
      contato: {
        title: t.contactTitle,
        description: t.contactMetaDesc,
        keywords: language === 'pt' ? 'contato cpf tools, suporte validador cpf' : 'contact cpf tools, cpf validator support'
      },
      privacidade: {
        title: language === 'pt' ? 'Política de Privacidade | CPF Tools' : 'Privacy Policy | CPF Tools',
        description: language === 'pt' ? 'Política de privacidade do CPF Tools: processamento 100% local, seus dados estão seguros.' : 'CPF Tools Privacy Policy: 100% local processing, your data is secure.',
        keywords: language === 'pt' ? 'privacidade, política, dados seguros' : 'privacy, policy, secure data'
      },
      termos: {
        title: language === 'pt' ? 'Termos de Uso | CPF Tools' : 'Terms of Use | CPF Tools',
        description: language === 'pt' ? 'Termos e condições para o uso correto da plataforma CPF Tools.' : 'Terms and conditions for the correct use of the CPF Tools platform.',
        keywords: language === 'pt' ? 'termos de uso, regras, legal' : 'terms of use, rules, legal'
      },
      'aviso-legal': {
        title: language === 'pt' ? 'Aviso Legal | CPF Tools' : 'Legal Notice | CPF Tools',
        description: t.disclaimerText,
        keywords: language === 'pt' ? 'aviso legal, disclaimer, cpf fictício' : 'legal notice, disclaimer, fictitious cpf'
      }
    };
    return meta[pageKey] || meta.home;
  };

  const pageMeta = getPageMeta();
  // Using currentCleanPath for canonical URL, assuming domain is geradorcpf.site (or the vercel URL for testing)
  // Note: For production, replace geradorcpf.site with your actual domain.
  const canonicalUrl = `https://geradorcpf.site${currentCleanPath}`;

  // --- NAVIGATION (Refactored to use History API) ---
  const Navigation = () => {
    const navItems = [
      { id: 'home', icon: Home, label: t.home, path: '/' },
      { id: 'generator', icon: Zap, label: t.generator, path: '/gerador-cpf' },
      { id: 'validator', icon: Shield, label: t.validator, path: '/validar-cpf' },
      { id: 'batch', icon: Users, label: t.batchTools, path: '/lote-cpf' },
      { id: 'about', icon: BookOpen, label: t.about, path: '/sobre-cpf-tools' },
      { id: 'contact', icon: Mail, label: t.contact, path: '/contato' }
    ];

    const NavLink = ({ path, children, ...props }) => (
      <a
        href={path}
        onClick={(e) => {
          e.preventDefault();
          navigate(path);
        }}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition text-sm ${
          currentCleanPath === path
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-700 hover:bg-blue-50'
        }`}
        {...props}
      >
        {children}
      </a>
    );

    return (
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
              className="flex items-center gap-2 text-lg sm:text-xl font-bold text-blue-600 hover:text-blue-700 transition"
            >
              <Shield size={24} className="sm:w-7 sm:h-7" />
              <span className="hidden sm:inline">CPF Tools</span>
            </a>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <NavLink
                  key={item.id}
                  path={item.path}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
              >
                <Globe size={16} />
                <span>{language === 'pt' ? 'EN' : 'PT'}</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-gray-200">
              {navItems.map(item => (
                <NavLink
                  key={item.id}
                  path={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                    currentPageId === item.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>
    );
  };

  // --- PAGE COMPONENTS (Existing) ---
  const HomePage = () => ( 
    <div>
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              {/* Optimized H1 to capture top keywords */}
              {t.heroTitle} 
            </h1>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-blue-100">
              {t.heroSubtitle}
            </p>
            <p className="text-base sm:text-lg mb-8 sm:mb-10 text-blue-50 leading-relaxed">
              {t.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/gerador-cpf" // Updated to clean URL
                onClick={(e) => { e.preventDefault(); navigate('/gerador-cpf'); }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-lg font-bold text-base sm:text-lg hover:bg-blue-50 transition shadow-lg flex items-center justify-center gap-2"
              >
                {t.getStarted}
                <ChevronRight size={20} />
              </a>
              <a
                href="/sobre-cpf-tools" // Updated to clean URL
                onClick={(e) => { e.preventDefault(); navigate('/sobre-cpf-tools'); }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-base sm:text-lg hover:bg-white hover:text-blue-600 transition"
              >
                {t.learnMore}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              { value: '2.5M+', label: t.stats.validations, color: 'blue' },
              { value: '1.8M+', label: t.stats.generated, color: 'green' },
              { value: '50K+', label: t.stats.users, color: 'purple' },
              { value: '99.9%', label: t.stats.uptime, color: 'orange' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className={`text-2xl sm:text-4xl font-bold text-${stat.color}-600 mb-1 sm:mb-2`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-base text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.features}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Zap, title: t.instantValidation, desc: t.instantDesc, color: '#2563EB' },
              { icon: RefreshCw, title: t.batchProcessing, desc: t.batchDesc, color: '#10B981' },
              { icon: Globe, title: t.regionalGen, desc: t.regionalDesc, color: '#9333EA' },
              { icon: Shield, title: t.securePrivate, desc: t.secureDesc, color: '#F97316' },
              { icon: Clock, title: t.offlineReady, desc: t.offlineDesc, color: '#EC4899' },
              { icon: Award, title: t.freeForever, desc: t.freeDesc, color: '#4F46E5' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6"
                     style={{ backgroundColor: `${feature.color}20` }}>
                  <feature.icon size={window.innerWidth < 640 ? 24 : 32} style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.howItWorks}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { num: '1', title: t.step1Title, desc: t.step1Desc, icon: Calculator },
              { num: '2', title: t.step2Title, desc: t.step2Desc, icon: FileCheck },
              { num: '3', title: t.step3Title, desc: t.step3Desc, icon: Check }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-blue-100 h-full">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold">
                      {step.num}
                    </div>
                    <step.icon className="text-blue-600" size={window.innerWidth < 640 ? 24 : 32} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="text-blue-300" size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.useCases}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {[
              { title: t.useCase1, desc: t.useCase1Desc, icon: Calculator },
              { title: t.useCase2, desc: t.useCase2Desc, icon: FileCheck },
              { title: t.useCase3, desc: t.useCase3Desc, icon: TrendingUp },
              { title: t.useCase4, desc: t.useCase4Desc, icon: BookOpen }
            ].map((useCase, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100 hover:border-blue-200 transition">
                <useCase.icon className="text-blue-600 mb-3 sm:mb-4" size={window.innerWidth < 640 ? 32 : 40} />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{useCase.title}</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
            {language === 'pt' ? 'Pronto para começar a gerar ou validar seu CPF?' : 'Ready to start generating or validating your CPF?'}
          </h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-blue-100">
            {language === 'pt'
              ? 'Comece a usar o melhor Gerador de CPF Válido agora mesmo, totalmente grátis!'
              : 'Start using the best CPF Generator right now, completely free!'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/gerador-cpf" // Updated to clean URL
              onClick={(e) => { e.preventDefault(); navigate('/gerador-cpf'); }}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-lg font-bold text-base sm:text-lg hover:bg-blue-50 transition shadow-lg"
            >
              {t.generateCPF}
            </a>
            <a
              href="/validar-cpf" // Updated to clean URL
              onClick={(e) => { e.preventDefault(); navigate('/validar-cpf'); }}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-base sm:text-lg hover:bg-white hover:text-blue-600 transition"
            >
              {t.validateCPF}
            </a>
          </div>
        </div>
      </section>

      {/* Google AdSense Placeholder */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-gray-200 rounded-lg p-8 border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">Ad Space - Google AdSense</p>
          </div>
        </div>
      </section>
    </div>
  );
  
  const GeneratorPage = () => ( 
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.generatorTitle}</h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {/* Added keyword rich intro */}
            {t.generatorIntro}
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-blue-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
              <Zap className="text-blue-600" size={window.innerWidth < 640 ? 24 : 28} />
              {t.generateCPF}
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.region}</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
                >
                  {Object.keys(t.states).map((key) => (
                    <option key={key} value={key}>{t.states[key]}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.formatOption}</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
                >
                  <option value="formatted">{t.formatted}</option>
                  <option value="unformatted">{t.unformatted}</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 shadow-lg mb-4 sm:mb-6"
            >
              <RefreshCw size={20} />
              {t.generate}
            </button>

            {generatedCPF && (
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 sm:p-8 border-2 border-blue-200">
                <p className="text-2xl sm:text-4xl font-mono font-bold text-center text-gray-900 mb-4 sm:mb-6 tracking-wider break-all">
                  {generatedCPF}
                </p>
                <button
                  onClick={() => copyToClipboard(generatedCPF)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 sm:py-4 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? t.copied : t.copy}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Ad Space */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
            <p className="text-gray-500 text-sm">Ad Space - Google AdSense</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">{t.whyUseGenerator}</h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {[t.generatorBenefit1, t.generatorBenefit2, t.generatorBenefit3, t.generatorBenefit4].map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 flex gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                    {idx + 1}
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  const ValidatorPage = () => ( /* ... existing ValidatorPage logic ... */
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.validatorTitle}</h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {/* Added keyword rich intro */}
            {t.validatorIntro}
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-blue-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
              <Shield className="text-blue-600" size={window.innerWidth < 640 ? 24 : 28} />
              {t.validateCPF}
            </h2>
            
            <input
              type="text"
              value={cpfInput}
              onChange={(e) => setCpfInput(e.target.value)}
              placeholder={t.enterCPF}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl mb-4 sm:mb-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-xl font-mono transition"
              maxLength={14}
            />

            <button
              onClick={handleValidate}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Shield size={20} />
              {t.validate}
            </button>

            {validationResult !== null && (
              <div className={`mt-6 sm:mt-8 p-6 sm:p-8 rounded-xl border-2 ${
                validationResult
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                  : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
              }`}>
                <div className="text-center">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    validationResult ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {validationResult ? (
                      <Check className="text-white" size={window.innerWidth < 640 ? 32 : 40} />
                    ) : (
                      <X className="text-white" size={window.innerWidth < 640 ? 32 : 40} />
                    )}
                  </div>
                  <p className={`text-xl sm:text-2xl font-bold ${
                    validationResult ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {validationResult ? t.valid : t.invalid}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ad Space */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
            <p className="text-gray-500 text-sm">Ad Space - Google AdSense</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">{t.whyUseValidator}</h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {[t.validatorBenefit1, t.validatorBenefit2, t.validatorBenefit3, t.validatorBenefit4].map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 flex gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                    {idx + 1}
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  const BatchGeneratorContent = () => ( /* ... existing BatchGeneratorContent logic ... */
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-blue-100">
        <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">{t.batchGenIntro}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 sm:mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.quantity}</label>
            <input
              type="number"
              value={batchCount}
              onChange={(e) => setBatchCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
              min="1"
              max="1000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.region}</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
            >
              {Object.keys(t.states).map((key) => (
                    <option key={key} value={key}>{t.states[key]}</option>
                  ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.formatOption}</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
            >
              <option value="formatted">{t.formatted}</option>
              <option value="unformatted">{t.unformatted}</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleBatchGenerate}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 shadow-lg mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <Zap size={20} />
          {t.generate} Lote
        </button>

        {batchCPFs.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 mt-4 sm:mt-6">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => exportToCSV(batchCPFs)}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Download size={18} />
                {t.exportCSV}
              </button>
              <button
                onClick={() => exportToJSON(batchCPFs)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Download size={18} />
                {t.exportJSON}
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto p-3 bg-white rounded-lg border">
              <p className="text-sm font-semibold text-gray-600 mb-2">{t.results}: {batchCPFs.length}</p>
              <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap break-all text-gray-700">
                {batchCPFs.join('\n')}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const BatchValidatorContent = () => ( /* ... existing BatchValidatorContent logic ... */
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-blue-100">
        <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">{t.batchValIntro}</p>
        
        <textarea
          placeholder={t.pasteList}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 sm:mb-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-48 font-mono text-xs sm:text-sm"
          onChange={(e) => handleBatchValidate(e.target.value)}
        />

        <div className="mb-4 sm:mb-6 p-4 bg-blue-50 rounded-lg text-center text-sm sm:text-base text-gray-700 border border-blue-100">
          {language === 'pt' 
            ? 'Os resultados aparecem automaticamente abaixo enquanto você cola a lista de CPFs.' 
            : 'Results appear automatically below as you paste the list of CPFs.'}
        </div>

        {batchValidationResults.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <div className="flex justify-between items-center mb-4 text-sm font-semibold">
              <span className="text-gray-600">{t.results}: {batchValidationResults.length}</span>
              <div className="flex gap-4">
                <span className="text-green-600">✓ {batchValidationResults.filter(r => r.valid).length}</span>
                <span className="text-red-600">✗ {batchValidationResults.filter(r => !r.valid).length}</span>
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {batchValidationResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg flex justify-between items-center transition text-sm sm:text-base ${
                    result.valid ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
                  }`}
                >
                  <span className="font-mono text-xs sm:text-sm">{result.cpf}</span>
                  <span className={`font-bold text-xs sm:text-sm ${
                    result.valid ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.valid ? '✓ ' + t.valid : '✗ ' + t.invalid}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const BatchToolsPage = () => ( /* ... existing BatchToolsPage logic ... */
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.batchToolsTitle}</h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {t.batchToolsMetaDesc}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 flex bg-gray-100 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => setBatchSubPage('generator')}
            className={`flex-1 py-3 px-4 text-center font-bold rounded-lg transition duration-300 text-sm sm:text-base ${
              batchSubPage === 'generator'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'text-gray-700 hover:bg-white'
            }`}
          >
            <Zap size={16} className="inline mr-2" />
            {t.generator}
          </button>
          <button
            onClick={() => setBatchSubPage('validator')}
            className={`flex-1 py-3 px-4 text-center font-bold rounded-lg transition duration-300 text-sm sm:text-base ${
              batchSubPage === 'validator'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'text-gray-700 hover:bg-white'
            }`}
          >
            <Shield size={16} className="inline mr-2" />
            {t.validator}
          </button>
        </div>

        {batchSubPage === 'generator' ? <BatchGeneratorContent /> : <BatchValidatorContent />}

        {/* Ad Space */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
            <p className="text-gray-500 text-sm">Ad Space - Google AdSense</p>
          </div>
        </div>
      </div>
    </div>
  );

  const AboutPage = () => ( /* ... existing AboutPage logic ... */
    <div className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.aboutTitle}</h1>
          <p className="text-base sm:text-xl text-gray-600">{t.aboutMetaDesc}</p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{t.ourMission}</h2>
            <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">{t.missionText}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-blue-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{t.cpfAlgorithm}</h2>
            <p className="text-sm sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">{t.algorithmText}</p>
            <div className="space-y-4">
              {[t.algorithm1, t.algorithm2, t.algorithm3, t.algorithm4].map((step, idx) => (
                <div key={idx} className="flex gap-3 sm:gap-4 items-start">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-yellow-200">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-900 mb-4 flex items-center gap-3">
              <Shield className="text-yellow-700" size={window.innerWidth < 640 ? 24 : 28} />
              {t.disclaimer}
            </h2>
            <p className="text-sm sm:text-lg text-yellow-800 leading-relaxed">{t.disclaimerText}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => ( /* ... existing ContactPage logic ... */
    <div className="py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.contactTitle}</h1>
          <p className="text-base sm:text-xl text-gray-600">{t.contactIntro}</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-blue-100">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Email</h3>
                <p className="text-gray-600 text-sm sm:text-base">contact@cpftools.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">
                  {language === 'pt' ? 'Suporte' : 'Support'}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {language === 'pt' ? 'Resposta em 24-48h' : 'Response in 24-48h'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 sm:p-6 border border-blue-100">
            <p className="text-sm sm:text-base text-gray-700 text-center leading-relaxed">
              {language === 'pt'
                ? 'Para questões técnicas, sugestões de recursos ou parcerias, entre em contato através do email acima. Estamos sempre abertos a feedback!'
                : 'For technical questions, feature suggestions or partnerships, contact us via the email above. We are always open to feedback!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // --- NEW LEGAL PAGE COMPONENTS ---

  const PrivacyPage = () => (
    <div className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.privacy}</h1>
          <p className="text-base sm:text-xl text-gray-600">
            {language === 'pt' ? 'Compromisso com a sua segurança e privacidade.' : 'Commitment to your security and privacy.'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-2 border-green-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Shield className="text-green-600" size={24} />
            {language === 'pt' ? 'Processamento de Dados' : 'Data Processing'}
          </h2>
          <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">{t.privacyText}</p>
        </div>
      </div>
    </div>
  );

  const TermsPage = () => (
    <div className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.terms}</h1>
          <p className="text-base sm:text-xl text-gray-600">
            {language === 'pt' ? 'Regras e diretrizes para o uso correto da plataforma.' : 'Rules and guidelines for the correct use of the platform.'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-2 border-blue-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <FileCheck className="text-blue-600" size={24} />
            {language === 'pt' ? 'Escopo de Uso' : 'Scope of Use'}
          </h2>
          <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">{t.termsText}</p>
        </div>
      </div>
    </div>
  );

  const LegalNoticePage = () => (
    <div className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.legal}</h1>
          <p className="text-base sm:text-xl text-gray-600">
            {language === 'pt' ? 'Informações sobre a natureza dos CPFs gerados.' : 'Information on the nature of generated CPFs.'}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-yellow-200">
          <h2 className="text-xl sm:text-2xl font-bold text-yellow-900 mb-4 flex items-center gap-3">
            <Award className="text-yellow-700" size={24} />
            {t.disclaimer}
          </h2>
          <p className="text-sm sm:text-lg text-yellow-800 leading-relaxed">{t.legalText}</p>
          </div>
        </div>
      </div>
    );

  // --- Main Content Renderer ---
  const renderContent = () => {
    // Note: The paths here match the clean URLs being pushed/read from the History API
    if (currentCleanPath.startsWith('/gerador-cpf')) return <GeneratorPage />;
    if (currentCleanPath.startsWith('/validar-cpf')) return <ValidatorPage />;
    if (currentCleanPath.startsWith('/lote-cpf')) return <BatchToolsPage />;
    if (currentCleanPath.startsWith('/sobre-cpf-tools')) return <AboutPage />;
    if (currentCleanPath.startsWith('/contato')) return <ContactPage />;
    if (currentCleanPath.startsWith('/politica-privacidade')) return <PrivacyPage />;
    if (currentCleanPath.startsWith('/termos-de-uso')) return <TermsPage />;
    if (currentCleanPath.startsWith('/aviso-legal')) return <LegalNoticePage />;
    return <HomePage />;
  };
  
  // --- FOOTER (Refactored to remove Tech and add Legal pages) ---
  const Footer = () => {
    // Function to navigate and close mobile menu if necessary (only used in mobile nav, but good practice)
    const handleFooterNav = (path, e) => {
      e.preventDefault();
      navigate(path);
      setMobileMenuOpen(false); // In case this is ever triggered by a mobile element
    };

    return (
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield size={28} className="text-blue-400" />
                <span className="text-lg sm:text-xl font-bold">CPF Tools</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                {t.footerAboutText}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-base sm:text-lg mb-4">{t.footerTools}</h3>
              <ul className="space-y-2">
                {[
                  { label: t.generator, path: '/gerador-cpf' },
                  { label: t.validator, path: '/validar-cpf' },
                  { label: t.batchTools, path: '/lote-cpf' }
                ].map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.path}
                      onClick={(e) => handleFooterNav(item.path, e)}
                      className="text-sm sm:text-base text-gray-400 hover:text-white transition"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-base sm:text-lg mb-4">{t.footerResources}</h3>
              <ul className="space-y-2">
                {[
                  { label: t.about, path: '/sobre-cpf-tools' },
                  { label: t.contact, path: '/contato' },
                  { label: t.documentation, path: '' }, // Placeholder - static
                  { label: t.faq, path: '' } // Placeholder - static
                ].map((item, idx) => (
                  <li key={idx}>
                    {item.path ? (
                      <a
                        href={item.path}
                        onClick={(e) => handleFooterNav(item.path, e)}
                        className="text-sm sm:text-base text-gray-400 hover:text-white transition"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span className="text-sm sm:text-base text-gray-400">{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* NEW LEGAL LINKS SECTION */}
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-4">
                {language === 'pt' ? 'Informações Legais' : 'Legal Information'}
              </h3>
              <ul className="space-y-2">
                {[
                  { label: t.privacy, path: '/politica-privacidade' },
                  { label: t.terms, path: '/termos-de-uso' },
                  { label: t.legal, path: '/aviso-legal' }
                ].map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.path}
                      onClick={(e) => handleFooterNav(item.path, e)}
                      className="text-sm sm:text-base text-gray-400 hover:text-white transition"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* END NEW LEGAL LINKS SECTION */}

          </div>

          <div className="border-t border-gray-700 pt-6 sm:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <p className="text-xs sm:text-sm text-gray-400">
                © 2025 CPF Tools | {language === 'pt' ? 'Desenvolvido com' : 'Built with'} ❤️ {language === 'pt' ? 'no Brasil' : 'in Brazil'}
              </p>
              {/* The links at the bottom are now correctly pointing to the full pages for redundancy */}
              <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
                <a href="/politica-privacidade" onClick={(e) => handleFooterNav('/politica-privacidade', e)} className="text-xs sm:text-sm text-gray-400 hover:text-white transition">
                  {language === 'pt' ? 'Privacidade' : 'Privacy'}
                </a>
                <a href="/termos-de-uso" onClick={(e) => handleFooterNav('/termos-de-uso', e)} className="text-xs sm:text-sm text-gray-400 hover:text-white transition">
                  {language === 'pt' ? 'Termos' : 'Terms'}
                </a>
                <a href="/aviso-legal" onClick={(e) => handleFooterNav('/aviso-legal', e)} className="text-xs sm:text-sm text-gray-400 hover:text-white transition">
                  {t.disclaimer}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-inter">
      {/* Dynamic <head> content for SEO. Using a React.Fragment to avoid invalid DOM nesting errors. */}
      <React.Fragment>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <meta name="keywords" content={pageMeta.keywords} />
        <meta name="author" content="CPF Tools" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={pageMeta.title} />
        <meta property="og:description" content={pageMeta.description} />
        <meta property="og:type" content="website" />
        {/* Canonical URL updated to use the full path, essential for SEO with clean routing */}
        <link rel="canonical" href={canonicalUrl} />
        {/* Corrected hreflang to hrefLang (camelCase for JSX) */}
        <link rel="alternate" hrefLang="pt-BR" href="https://geradorcpf.site/" />
        <link rel="alternate" hrefLang="en" href="https://geradorcpf.site/en" /> 
        <link rel="alternate" hrefLang="x-default" href="https://geradorcpf.site/" />
        
        {/* Google Analytics Placeholder */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `
        }} />
        
        {/* Google AdSense Placeholder */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous"></script>
      </React.Fragment>

      <Navigation />
      
      <main>
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
};

export default CPFValidatorGenerator;
