import React, { useState, useEffect } from 'react';
import { Copy, Check, Upload, Download, RefreshCw, Shield, Zap, Globe, Home, Calculator, FileCheck, Users, BookOpen, Mail, Menu, X, ChevronRight, Star, TrendingUp, Award, Clock } from 'lucide-react';

const CPFValidatorGenerator = () => {
  const [language, setLanguage] = useState('pt');
  const [currentPage, setCurrentPage] = useState('home');
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
    // New state for sub-navigation within Batch Tools page
    const [batchSubPage, setBatchSubPage] = useState('generator'); // 'generator' or 'validator'

  const translations = {
    pt: {
      // Navigation
      home: 'Início',
      generator: 'Gerador',
      validator: 'Validador',
      batchTools: 'Ferramentas em Lote',
      about: 'Sobre',
      contact: 'Contato',
      
      // Hero Section
      heroTitle: 'Validador e Gerador de CPF Profissional',
      heroSubtitle: 'A solução completa para validação e geração de CPF com algoritmo matemático certificado',
      heroDescription: 'Gere CPFs válidos para testes de desenvolvimento, valide números existentes instantaneamente e processe milhares de documentos em segundos. Ferramenta 100% gratuita, segura e confiável.',
      getStarted: 'Começar Agora',
      learnMore: 'Saiba Mais',
      
      // Stats
      stats: {
        validations: 'Validações Realizadas',
        generated: 'CPFs Gerados',
        users: 'Usuários Ativos',
        uptime: 'Disponibilidade'
      },
      
      // Features
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
      
      // How it works
      howItWorks: 'Como Funciona',
      step1Title: 'Escolha sua Ferramenta',
      step1Desc: 'Selecione entre gerador, validador ou processamento em lote',
      step2Title: 'Configure suas Opções',
      step2Desc: 'Defina região, formato e quantidade conforme necessário',
      step3Title: 'Obtenha Resultados',
      step3Desc: 'Receba CPFs válidos ou resultados de validação instantaneamente',
      
      // Use Cases
      useCases: 'Casos de Uso',
      useCase1: 'Testes de Desenvolvimento',
      useCase1Desc: 'Gere dados fictícios para testar formulários e sistemas',
      useCase2: 'Validação de Dados',
      useCase2Desc: 'Verifique a integridade de bases de dados de CPF',
      useCase3: 'Auditoria Massiva',
      useCase3Desc: 'Processe milhares de CPFs em segundos',
      useCase4: 'Educação e Treinamento',
      useCase4Desc: 'Ensine sobre o algoritmo de validação de CPF',
      
      // Generator Page
      generateCPF: 'Gerar CPF',
      generatorTitle: 'Gerador de CPF - Crie CPFs Válidos Instantaneamente',
      generatorMetaDesc: 'Gere CPFs válidos matematicamente com nosso gerador online gratuito. Escolha a região brasileira, formato e gere múltiplos CPFs para testes de desenvolvimento.',
      generatorIntro: 'Nosso gerador de CPF utiliza o algoritmo oficial brasileiro para criar números de CPF matematicamente válidos. Ideal para desenvolvedores que precisam testar sistemas, formulários e validações.',
      whyUseGenerator: 'Por que usar nosso Gerador?',
      generatorBenefit1: 'CPFs matematicamente válidos seguindo o algoritmo oficial da Receita Federal',
      generatorBenefit2: 'Geração por região específica (todos os estados brasileiros)',
      generatorBenefit3: 'Formato customizável (com ou sem pontuação)',
      generatorBenefit4: 'Geração instantânea sem necessidade de cadastro',
      
      // Validator Page
      validateCPF: 'Validar CPF',
      validatorTitle: 'Validador de CPF - Verifique CPFs Instantaneamente',
      validatorMetaDesc: 'Valide CPFs online gratuitamente com nosso validador que usa o algoritmo matemático oficial. Verifique a autenticidade de qualquer CPF em milissegundos.',
      validatorIntro: 'Verifique se um número de CPF é válido usando o algoritmo matemático oficial. Nossa ferramenta analisa os dígitos verificadores e confirma a integridade do número instantaneamente.',
      whyUseValidator: 'Por que usar nosso Validador?',
      validatorBenefit1: 'Validação instantânea usando algoritmo matemático certificado',
      validatorBenefit2: 'Detecta CPFs com dígitos verificadores incorretos',
      validatorBenefit3: 'Identifica sequências numéricas inválidas (ex: 111.111.111-11)',
      validatorBenefit4: 'Interface simples e intuitiva para validação rápida',
      
      // Batch Tools Page
      batchToolsTitle: 'Ferramentas em Lote',
      batchToolsMetaDesc: 'Processe milhares de CPFs de uma vez. Gere ou valide em lote com exportação em CSV/JSON. Perfeito para desenvolvedores e analistas de dados.',
      batchGenTitle: 'Geração em Lote',
      batchGenIntro: 'Gere centenas ou milhares de CPFs válidos simultaneamente. Perfeito para popular bancos de dados de teste, criar datasets ou realizar testes de carga em sistemas.',
      batchValTitle: 'Validação em Lote',
      batchValIntro: 'Valide grandes listas de CPFs de uma só vez. Cole uma lista, carregue um arquivo ou importe dados para verificar a validade de milhares de CPFs instantaneamente.',
      
      // About Page
      aboutTitle: 'Sobre o Validador de CPF',
      aboutMetaDesc: 'Conheça a ferramenta de validação e geração de CPF mais completa do Brasil. Algoritmo matemático oficial, processamento local e 100% gratuito.',
      ourMission: 'Nossa Missão',
      missionText: 'Fornecer ferramentas gratuitas, precisas e acessíveis para validação e geração de CPF, auxiliando desenvolvedores, empresas e cidadãos brasileiros em suas necessidades diárias.',
      cpfAlgorithm: 'O Algoritmo do CPF',
      algorithmText: 'O CPF (Cadastro de Pessoas Físicas) utiliza um algoritmo matemático de verificação baseado em módulo 11. Os dois últimos dígitos são dígitos verificadores calculados a partir dos nove primeiros números, garantindo a integridade do documento.',
      algorithm1: 'Os 9 primeiros dígitos são números aleatórios (com o 9º indicando a região)',
      algorithm2: 'O 10º dígito é calculado multiplicando cada um dos 9 primeiros por pesos de 10 a 2',
      algorithm3: 'O 11º dígito é calculado multiplicando os 10 primeiros por pesos de 11 a 2',
      algorithm4: 'Ambos usam módulo 11 para determinar o dígito verificador final',
      
      // Contact Page
      contactTitle: 'Entre em Contato',
      contactMetaDesc: 'Tem dúvidas sobre nossa ferramenta de CPF? Entre em contato conosco para suporte, sugestões ou parcerias.',
      contactIntro: 'Estamos aqui para ajudar! Se você tem dúvidas, sugestões ou encontrou algum problema, ficaremos felizes em ouvir de você.',
      
      // Common Elements
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
      
      // Footer
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
        es: 'Espírito Santo (7)', // Grouping for selection clarity, but the code uses the 9th digit rule
        mg: 'Minas Gerais (3)',
        pr: 'Paraná, SC (9)',
        sc: 'Santa Catarina (9)', // Grouping for selection clarity, but the code uses the 9th digit rule
        ba: 'Bahia, Sergipe (5)',
        pe: 'Pernambuco, AL, PB, RN (4)',
        ce: 'Ceará, MA, PI (6)',
        am: 'Amazonas, AC, AP, PA, RO, RR (2)'
      }
    },
    en: {
      // Navigation
      home: 'Home',
      generator: 'Generator',
      validator: 'Validator',
      batchTools: 'Batch Tools',
      about: 'About',
      contact: 'Contact',
      
      // Hero Section
      heroTitle: 'Professional CPF Validator & Generator',
      heroSubtitle: 'Complete solution for CPF validation and generation with certified mathematical algorithm',
      heroDescription: 'Generate valid CPFs for development testing, validate existing numbers instantly, and process thousands of documents in seconds. 100% free, secure, and reliable tool.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      
      // Stats
      stats: {
        validations: 'Validations Performed',
        generated: 'CPFs Generated',
        users: 'Active Users',
        uptime: 'Uptime'
      },
      
      // Features
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
      
      // How it works
      howItWorks: 'How It Works',
      step1Title: 'Choose Your Tool',
      step1Desc: 'Select between generator, validator or batch processing',
      step2Title: 'Configure Options',
      step2Desc: 'Set region, format and quantity as needed',
      step3Title: 'Get Results',
      step3Desc: 'Receive valid CPFs or validation results instantly',
      
      // Use Cases
      useCases: 'Use Cases',
      useCase1: 'Development Testing',
      useCase1Desc: 'Generate dummy data to test forms and systems',
      useCase2: 'Data Validation',
      useCase2Desc: 'Verify integrity of CPF databases',
      useCase3: 'Mass Auditing',
      useCase3Desc: 'Process thousands of CPFs in seconds',
      useCase4: 'Education & Training',
      useCase4Desc: 'Teach about CPF validation algorithm',
      
      // Generator Page
      generateCPF: 'Generate CPF',
      generatorTitle: 'CPF Generator - Create Valid CPFs Instantly',
      generatorMetaDesc: 'Generate mathematically valid CPFs with our free online generator. Choose Brazilian region, format and generate multiple CPFs for development testing.',
      generatorIntro: 'Our CPF generator uses the official Brazilian algorithm to create mathematically valid CPF numbers. Ideal for developers who need to test systems, forms and validations.',
      whyUseGenerator: 'Why use our Generator?',
      generatorBenefit1: 'Mathematically valid CPFs following the official Federal Revenue algorithm',
      generatorBenefit2: 'Generation by specific region (all Brazilian states)',
      generatorBenefit3: 'Customizable format (with or without punctuation)',
      generatorBenefit4: 'Instant generation without registration required',
      
      // Validator Page
      validateCPF: 'Validate CPF',
      validatorTitle: 'CPF Validator - Verify CPFs Instantly',
      validatorMetaDesc: 'Validate CPFs online for free with our validator that uses the official mathematical algorithm. Verify the authenticity of any CPF in milliseconds.',
      validatorIntro: 'Check if a CPF number is valid using the official mathematical algorithm. Our tool analyzes the check digits and confirms the number integrity instantly.',
      whyUseValidator: 'Why use our Validator?',
      validatorBenefit1: 'Instant validation using certified mathematical algorithm',
      validatorBenefit2: 'Detects CPFs with incorrect check digits',
      validatorBenefit3: 'Identifies invalid numeric sequences (e.g., 111.111.111-11)',
      validatorBenefit4: 'Simple and intuitive interface for quick validation',
      
      // Batch Tools Page
      batchToolsTitle: 'Batch Tools',
      batchToolsMetaDesc: 'Process thousands of CPFs at once. Generate or validate in batch with CSV/JSON export. Perfect for developers and data analysts.',
      batchGenTitle: 'Batch Generation',
      batchGenIntro: 'Gere centenas ou milhares de CPFs válidos simultaneamente. Perfeito para popular bancos de dados de teste, criar datasets ou realizar testes de carga em sistemas.',
      batchValTitle: 'Batch Validation',
      batchValIntro: 'Valide grandes listas de CPFs de uma só vez. Cole uma lista, carregue um arquivo ou importe dados para verificar a validade de milhares de CPFs instantaneamente.',
      
      // About Page
      aboutTitle: 'Sobre o Validador de CPF',
      aboutMetaDesc: 'Conheça a ferramenta de validação e geração de CPF mais completa do Brasil. Algoritmo matemático oficial, processamento local e 100% gratuito.',
      ourMission: 'Nossa Missão',
      missionText: 'Fornecer ferramentas gratuitas, precisas e acessíveis para validação e geração de CPF, auxiliando desenvolvedores, empresas e cidadãos brasileiros em suas necessidades diárias.',
      cpfAlgorithm: 'O Algoritmo do CPF',
      algorithmText: 'O CPF (Cadastro de Pessoas Físicas) utiliza um algoritmo matemático de verificação baseado em módulo 11. Os dois últimos dígitos são dígitos verificadores calculados a partir dos nove primeiros números, garantindo a integridade do documento.',
      algorithm1: 'Os 9 primeiros dígitos são números aleatórios (com o 9º indicando a região)',
      algorithm2: 'O 10º dígito é calculado multiplicando cada um dos 9 primeiros por pesos de 10 a 2',
      algorithm3: 'O 11º dígito é calculado multiplicando os 10 primeiros por pesos de 11 a 2',
      algorithm4: 'Ambos usam módulo 11 para determinar o dígito verificador final',
      
      // Contact Page
      contactTitle: 'Entre em Contato',
      contactMetaDesc: 'Tem dúvidas sobre nossa ferramenta de CPF? Entre em contato conosco para suporte, sugestões ou parcerias.',
      contactIntro: 'Estamos aqui para ajudar! Se você tem dúvidas, sugestões ou encontrou algum problema, ficaremos felizes em ouvir de você.',
      
      // Common Elements
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
      
      // Footer
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
        all: 'All Regions',
        rs: 'Rio Grande do Sul (0)',
        df: 'Federal District, GO, MS, MT, TO (1)',
        sp: 'São Paulo (8)',
        rj: 'Rio de Janeiro, ES (7)',
        es: 'Espírito Santo (7)',
        mg: 'Minas Gerais (3)',
        pr: 'Paraná, SC (9)',
        sc: 'Santa Catarina (9)',
        ba: 'Bahia, Sergipe (5)',
        pe: 'Pernambuco, AL, PB, RN (4)',
        ce: 'Ceará, MA, PI (6)',
        am: 'Amazonas, AC, AP, PA, RO, RR (2)'
      }
    }
  };

  const t = translations[language];

  // CPF Generation Algorithm
  const generateCPF = (regionCode = null) => {
    let cpf = [];
    
    for (let i = 0; i < 9; i++) {
      if (i === 8 && regionCode !== null) {
        // The 9th digit (index 8) determines the region
        const regionMap = { 
            0: 0, 1: 1, 8: 8, 7: 7, 3: 3, 9: 9, 5: 5, 4: 4, 6: 6, 2: 2 
        };
        // Use the region code for the 9th digit (index 8) if specified.
        cpf.push(regionMap[regionCode] || 0);

      } else {
        // Generate random digit
        cpf.push(Math.floor(Math.random() * 10));
      }
    }

    // If a region was selected, override the 9th digit (index 8) with the correct region code
    const specificRegionCode = regionCodes[region];
    if (specificRegionCode !== null) {
        cpf[8] = specificRegionCode;
    }


    // Calculate first check digit (10th digit)
    let sum1 = 0;
    for (let i = 0; i < 9; i++) {
      sum1 += cpf[i] * (10 - i);
    }
    let remainder1 = sum1 % 11;
    let checkDigit1 = remainder1 < 2 ? 0 : 11 - remainder1;
    cpf.push(checkDigit1);

    // Calculate second check digit (11th digit)
    let sum2 = 0;
    for (let i = 0; i < 10; i++) {
      sum2 += cpf[i] * (11 - i);
    }
    let remainder2 = sum2 % 11;
    let checkDigit2 = remainder2 < 2 ? 0 : 11 - remainder2;
    cpf.push(checkDigit2);

    return cpf.join('');
  };

  // CPF Validation Algorithm
  const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Check for known invalid sequences (e.g., all same digits)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Calculate first check digit
    let sum1 = 0;
    for (let i = 0; i < 9; i++) {
      sum1 += parseInt(cpf[i]) * (10 - i);
    }
    let remainder1 = sum1 % 11;
    let checkDigit1 = remainder1 < 2 ? 0 : 11 - remainder1;
    
    if (checkDigit1 !== parseInt(cpf[9])) return false;

    // Calculate second check digit
    let sum2 = 0;
    for (let i = 0; i < 10; i++) {
      sum2 += parseInt(cpf[i]) * (11 - i);
    }
    let remainder2 = sum2 % 11;
    let checkDigit2 = remainder2 < 2 ? 0 : 11 - remainder2;
    
    return checkDigit2 === parseInt(cpf[10]);
  };

  const formatCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // The 9th digit (index 8) of the CPF determines the regional origin.
  const regionCodes = {
    all: null, // Any region
    rs: 0, // Rio Grande do Sul
    df: 1, // DF, GO, MS, MT, TO
    am: 2, // Amazonas, AC, AP, PA, RO, RR
    mg: 3, // Minas Gerais
    pe: 4, // Pernambuco, AL, PB, RN
    ba: 5, // Bahia, Sergipe
    ce: 6, // Ceará, MA, PI
    rj: 7, // Rio de Janeiro, ES
    sp: 8, // São Paulo
    pr: 9, // Paraná, SC
    // Using primary state for the 9th digit code, as per the translation map
    es: 7, 
    sc: 9,
    go: 1,
    ms: 1,
    mt: 1,
    to: 1
  };

  const handleGenerate = () => {
    const regionCode = regionCodes[region];
    const cpf = generateCPF(regionCode);
    setGeneratedCPF(format === 'formatted' ? formatCPF(cpf) : cpf);
  };

  const handleBatchGenerate = () => {
    const cpfs = [];
    const regionCode = regionCodes[region];
    const count = Math.min(batchCount, 1000);
    
    for (let i = 0; i < count; i++) {
      const cpf = generateCPF(regionCode);
      cpfs.push(format === 'formatted' ? formatCPF(cpf) : cpf);
    }
    setBatchCPFs(cpfs);
  };

  const handleValidate = () => {
    const isValid = validateCPF(cpfInput);
    setValidationResult(isValid);
  };

  const handleBatchValidate = (text) => {
    // Sanitize input: remove non-digit characters and split by newline, then filter empty lines
    const cpfs = text.split(/[\n,]/).map(line => line.replace(/[^\d]/g, '')).filter(line => line.trim() && line.length === 11);
    const results = cpfs.map(cpf => ({
      cpf: formatCPF(cpf),
      valid: validateCPF(cpf)
    }));
    setBatchValidationResults(results);
  };

  const copyToClipboard = (text) => {
    // Using document.execCommand('copy') for better compatibility in iframe environments
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

  useEffect(() => {
    handleGenerate();
  }, []);

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition"
            >
              <Shield size={28} />
              <span className="hidden sm:inline">CPF Tools</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { id: 'home', icon: Home, label: t.home },
              { id: 'generator', icon: Zap, label: t.generator },
              { id: 'validator', icon: Shield, label: t.validator },
              { id: 'batch', icon: Users, label: t.batchTools },
              { id: 'about', icon: BookOpen, label: t.about },
              { id: 'contact', icon: Mail, label: t.contact }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md"
            >
              <Globe size={18} />
              <span className="font-semibold">{language === 'pt' ? 'EN' : 'PT'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {[
              { id: 'home', icon: Home, label: t.home },
              { id: 'generator', icon: Zap, label: t.generator },
              { id: 'validator', icon: Shield, label: t.validator },
              { id: 'batch', icon: Users, label: t.batchTools },
              { id: 'about', icon: BookOpen, label: t.about },
              { id: 'contact', icon: Mail, label: t.contact }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );

  // Home Page
  const HomePage = () => (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100 font-light">
              {t.heroSubtitle}
            </p>
            <p className="text-lg mb-10 text-blue-50 leading-relaxed">
              {t.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('generator')}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg flex items-center justify-center gap-2"
              >
                {t.getStarted}
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => setCurrentPage('about')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition"
              >
                {t.learnMore}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2.5M+</div>
              <div className="text-gray-600 font-medium">{t.stats.validations}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">1.8M+</div>
              <div className="text-gray-600 font-medium">{t.stats.generated}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">{t.stats.users}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-gray-600 font-medium">{t.stats.uptime}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.features}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'pt' 
                ? 'Tudo o que você precisa para trabalhar com CPF de forma profissional e eficiente'
                : 'Everything you need to work with CPF professionally and efficiently'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: t.instantValidation, desc: t.instantDesc, color: 'blue' },
              { icon: RefreshCw, title: t.batchProcessing, desc: t.batchDesc, color: 'green' },
              { icon: Globe, title: t.regionalGen, desc: t.regionalDesc, color: 'purple' },
              { icon: Shield, title: t.securePrivate, desc: t.secureDesc, color: 'orange' },
              { icon: Clock, title: t.offlineReady, desc: t.offlineDesc, color: 'pink' },
              { icon: Award, title: t.freeForever, desc: t.freeDesc, color: 'indigo' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1">
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-6`}>
                  {/* NOTE: Tailwind dynamically generated classes require full string to work, so we use a style hack for colors in the loop. */}
                  <feature.icon 
                        style={{ color: {blue: '#2563EB', green: '#10B981', purple: '#9333EA', orange: '#F97316', pink: '#EC4899', indigo: '#4F46E5'}[feature.color] }}
                        size={32} 
                    />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.howItWorks}</h2>
            <p className="text-xl text-gray-600">
              {language === 'pt'
                ? 'Simples, rápido e eficiente em apenas 3 passos'
                : 'Simple, fast and efficient in just 3 steps'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', title: t.step1Title, desc: t.step1Desc, icon: Calculator },
              { num: '2', title: t.step2Title, desc: t.step2Desc, icon: FileCheck },
              { num: '3', title: t.step3Title, desc: t.step3Desc, icon: Check }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border-2 border-blue-100 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {step.num}
                  </div>
                    <step.icon className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
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

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.useCases}</h2>
            <p className="text-xl text-gray-600">
              {language === 'pt'
                ? 'Descubra como nossa ferramenta pode ajudar você'
                : 'Discover how our tool can help you'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: t.useCase1, desc: t.useCase1Desc, icon: Calculator },
              { title: t.useCase2, desc: t.useCase2Desc, icon: FileCheck },
              { title: t.useCase3, desc: t.useCase3Desc, icon: TrendingUp },
              { title: t.useCase4, desc: t.useCase4Desc, icon: BookOpen }
            ].map((useCase, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:border-blue-200 transition">
                <useCase.icon className="text-blue-600 mb-4" size={40} />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600 leading-relaxed">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {language === 'pt'
              ? 'Pronto para começar?'
              : 'Ready to get started?'}
          </h2>
          <p className="text-xl mb-10 text-blue-100">
            {language === 'pt'
              ? 'Comece a usar nossa ferramenta agora mesmo, totalmente grátis!'
              : 'Start using our tool right now, completely free!'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('generator')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg"
            >
              {t.generateCPF}
            </button>
            <button
              onClick={() => setCurrentPage('validator')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition"
            >
              {t.validateCPF}
            </button>
          </div>
         
        </div>
      </section>
    </div>
  );

  // Generator Page
  const GeneratorPage = () => (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.generatorTitle}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.generatorIntro}
          </p>
        </div>

        {/* Generator Tool */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Zap className="text-blue-600" />
              {t.generateCPF}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.region}</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="formatted">{t.formatted}</option>
                  <option value="unformatted">{t.unformatted}</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 shadow-lg mb-6"
            >
              <RefreshCw size={20} />
              {t.generate}
            </button>

            {generatedCPF && (
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-8 border-2 border-blue-200">
                <p className="text-4xl font-mono font-bold text-center text-gray-900 mb-6 tracking-wider">
                  {generatedCPF}
                </p>
                <button
                  onClick={() => copyToClipboard(generatedCPF)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-2 shadow-lg"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? t.copied : t.copy}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t.whyUseGenerator}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[t.generatorBenefit1, t.generatorBenefit2, t.generatorBenefit3, t.generatorBenefit4].map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Validator Page
  const ValidatorPage = () => (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.validatorTitle}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.validatorIntro}
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Shield className="text-blue-600" />
              {t.validateCPF}
            </h2>
            
            <input
              type="text"
              value={cpfInput}
              onChange={(e) => setCpfInput(e.target.value)}
              placeholder={t.enterCPF}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl font-mono transition"
              maxLength={14}
            />

            <button
              onClick={handleValidate}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Shield size={20} />
              {t.validate}
            </button>

            {validationResult !== null && (
              <div className={`mt-8 p-8 rounded-xl border-2 ${
                validationResult
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                  : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
              }`}>
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    validationResult ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {validationResult ? (
                      <Check className="text-white" size={40} />
                    ) : (
                      <X className="text-white" size={40} />
                    )}
                  </div>
                  <p className={`text-2xl font-bold ${
                    validationResult ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {validationResult ? t.valid : t.invalid}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t.whyUseValidator}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[t.validatorBenefit1, t.validatorBenefit2, t.validatorBenefit3, t.validatorBenefit4].map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

    // --- NEW BATCH TOOLS SUB-COMPONENTS ---
    
    // Component for Batch Generation Logic
    const BatchGeneratorContent = () => (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100">
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{t.batchGenIntro}</p>

                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t.quantity}</label>
                        <input
                            type="number"
                            value={batchCount}
                            onChange={(e) => setBatchCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            min="1"
                            max="1000"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t.region}</label>
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            <option value="formatted">{t.formatted}</option>
                            <option value="unformatted">{t.unformatted}</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleBatchGenerate}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 shadow-lg mb-6"
                >
                    <Zap size={20} />
                    {t.generate} Lote
                </button>

                {batchCPFs.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 mt-6">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                                onClick={() => exportToCSV(batchCPFs)}
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-2"
                            >
                                <Download size={18} />
                                {t.exportCSV}
                            </button>
                            <button
                                onClick={() => exportToJSON(batchCPFs)}
                                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition flex items-center justify-center gap-2"
                            >
                                <Download size={18} />
                                {t.exportJSON}
                            </button>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto p-3 bg-white rounded-lg border">
                            <p className="text-sm font-semibold text-gray-600 mb-2">{t.results}: {batchCPFs.length}</p>
                            <pre className="text-sm font-mono whitespace-pre-wrap break-all text-gray-700">
                                {batchCPFs.join('\n')}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Component for Batch Validation Logic
    const BatchValidatorContent = () => (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100">
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{t.batchValIntro}</p>
                
                <textarea
                    placeholder={t.pasteList}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-48 font-mono text-sm"
                    onChange={(e) => handleBatchValidate(e.target.value)}
                />

                {/* Note: Batch validation happens on input change now, so no separate button is strictly needed, 
                   but we can add a prompt to encourage action */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center text-gray-700 border border-blue-100">
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
                                    className={`p-3 rounded-lg flex justify-between items-center transition ${
                                        result.valid ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
                                    }`}
                                >
                                    <span className="font-mono text-sm">{result.cpf}</span>
                                    <span className={`font-bold text-sm ${
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
    
  // Batch Tools Page (now acts as a router with tabs)
  const BatchToolsPage = () => (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.batchToolsTitle}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.batchToolsMetaDesc}
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="max-w-2xl mx-auto mb-12 flex bg-gray-100 rounded-xl p-1 shadow-inner">
            <button
                onClick={() => setBatchSubPage('generator')}
                className={`flex-1 py-3 px-4 text-center font-bold rounded-lg transition duration-300 ${
                    batchSubPage === 'generator'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'text-gray-700 hover:bg-white'
                }`}
            >
                <Zap size={18} className="inline mr-2" />
                {t.batchGenTitle}
            </button>
            <button
                onClick={() => setBatchSubPage('validator')}
                className={`flex-1 py-3 px-4 text-center font-bold rounded-lg transition duration-300 ${
                    batchSubPage === 'validator'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'text-gray-700 hover:bg-white'
                }`}
            >
                <Shield size={18} className="inline mr-2" />
                {t.batchValTitle}
            </button>
        </div>

        {/* Content Switch */}
        {batchSubPage === 'generator' ? <BatchGeneratorContent /> : <BatchValidatorContent />}

      </div>
    </div>
  );

  // About Page
  const AboutPage = () => (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.aboutTitle}</h1>
          <p className="text-xl text-gray-600">{t.aboutMetaDesc}</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.ourMission}</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{t.missionText}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg p-8 border-2 border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.cpfAlgorithm}</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">{t.algorithmText}</p>
            <div className="space-y-4">
              {[t.algorithm1, t.algorithm2, t.algorithm3, t.algorithm4].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
            <h2 className="text-2xl font-bold text-yellow-900 mb-4 flex items-center gap-3">
              <Shield className="text-yellow-700" />
              {t.disclaimer}
            </h2>
            <p className="text-yellow-800 leading-relaxed text-lg">{t.disclaimerText}</p>
          </div>
        </div>
        
      </div>
    </div>
  );

  // Contact Page - COMPLETED AND CORRECTED
  const ContactPage = () => (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.contactTitle}</h1>
          <p className="text-xl text-gray-600">{t.contactIntro}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100">
          {/* Contact Details Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">contact@cpftools.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {language === 'pt' ? 'Suporte' : 'Support'}
                </h3>
                <p className="text-gray-600">
                  {language === 'pt' ? 'Resposta em 24-48h' : 'Response in 24-48h'}
                </p>
              </div>
            </div>
          </div>

          {/* Message Box */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
            <p className="text-gray-700 text-center leading-relaxed">
              {language === 'pt'
                ? 'Para questões técnicas, sugestões de recursos ou parcerias, entre em contato através do email acima. Estamos sempre abertos a feedback!'
                : 'For technical questions, feature suggestions or partnerships, contact us via the email above. We are always open to feedback!'}
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );

  // Footer Component
  const Footer = () => (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield size={32} className="text-blue-400" />
              <span className="text-xl font-bold">CPF Tools</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              {t.footerAboutText}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t.footerTools}</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentPage('generator')}
                  className="text-gray-400 hover:text-white transition"
                >
                  {t.generator}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('validator')}
                  className="text-gray-400 hover:text-white transition"
                >
                  {t.validator}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('batch')}
                  className="text-gray-400 hover:text-white transition"
                >
                  {t.batchTools}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t.footerResources}</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentPage('about')}
                  className="text-gray-400 hover:text-white transition"
                >
                  {t.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="text-gray-400 hover:text-white transition"
                >
                  {t.contact}
                </button>
              </li>
              <li>
                <span className="text-gray-400">{t.documentation}</span>
              </li>
              <li>
                <span className="text-gray-400">{t.faq}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">
              {language === 'pt' ? 'Tecnologias' : 'Technologies'}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Star size={16} className="text-blue-400" />
                React 18
              </li>
              <li className="flex items-center gap-2">
                <Star size={16} className="text-blue-400" />
                Tailwind CSS
              </li>
              <li className="flex items-center gap-2">
                <Star size={16} className="text-blue-400" />
                PWA Ready
              </li>
              <li className="flex items-center gap-2">
                <Star size={16} className="text-blue-400" />
                100% Local Processing
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-left">
              © 2025 CPF Tools | {language === 'pt' ? 'Desenvolvido com' : 'Built with'} ❤️ {language === 'pt' ? 'no Brasil' : 'in Brazil'}
            </p>
            <div className="flex gap-6">
              <span className="text-gray-400 text-sm">{language === 'pt' ? 'Privacidade' : 'Privacy'}</span>
              <span className="text-gray-400 text-sm">{language === 'pt' ? 'Termos' : 'Terms'}</span>
              <span className="text-gray-400 text-sm">{t.disclaimer}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navigation />
      
      <main>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'generator' && <GeneratorPage />}
        {currentPage === 'validator' && <ValidatorPage />}
        {currentPage === 'batch' && <BatchToolsPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      <Footer />
    </div>
  );
};

export default CPFValidatorGenerator;
