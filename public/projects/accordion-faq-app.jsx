const { useState, useEffect, useRef } = React;

var faqData = [
  { question: 'What is microbiology?', answer: 'Microbiology is the scientific study of microorganisms, including bacteria, viruses, fungi, protozoa, and algae. It encompasses their structure, function, genetics, ecology, and roles in disease, industry, and the environment.' },
  { question: 'What are the main types of microorganisms?', answer: 'The main types are bacteria (prokaryotic single-celled organisms), viruses (non-cellular infectious agents), fungi (eukaryotic organisms including yeasts and molds), protozoa (single-celled eukaryotes), and algae (photosynthetic eukaryotes). Prions, though not organisms, are also studied.' },
  { question: 'What is the difference between prokaryotes and eukaryotes?', answer: 'Prokaryotes (bacteria, archaea) lack a membrane-bound nucleus and organelles; their DNA is in a nucleoid region. Eukaryotes (fungi, protozoa, algae) have a true nucleus enclosed by a nuclear membrane, along with membrane-bound organelles like mitochondria and endoplasmic reticulum.' },
  { question: 'Who is considered the father of microbiology?', answer: 'Antonie van Leeuwenhoek is often called the father of microbiology for being the first to observe and describe microorganisms using his handcrafted microscopes in the 1670s. Louis Pasteur and Robert Koch are also foundational figures for their work on germ theory and disease causation.' },
  { question: 'What is the germ theory of disease?', answer: 'The germ theory states that specific microorganisms are the cause of specific diseases. Developed primarily by Louis Pasteur and Robert Koch in the 19th century, it replaced the miasma theory and revolutionized medicine, leading to antiseptic techniques, vaccines, and antibiotics.' },
  { question: 'What are Koch\'s postulates?', answer: 'Koch\'s postulates are four criteria to establish a causal relationship between a microbe and a disease: (1) the microbe must be found in all diseased organisms, (2) it must be isolated and grown in pure culture, (3) the cultured microbe must cause disease when introduced into a healthy organism, and (4) the microbe must be re-isolated from the new host.' },
  { question: 'What is the difference between Gram-positive and Gram-negative bacteria?', answer: 'Gram-positive bacteria have a thick peptidoglycan cell wall that retains the crystal violet stain (appearing purple). Gram-negative bacteria have a thin peptidoglycan layer and an outer membrane containing lipopolysaccharide; they lose the crystal violet and stain pink with safranin counterstain.' },
  { question: 'What is peptidoglycan?', answer: 'Peptidoglycan (murein) is a polymer of sugars (NAG and NAM) cross-linked by short peptide chains. It forms the rigid mesh-like layer of bacterial cell walls, providing structural strength and shape. It is the target of antibiotics like penicillin and vancomycin.' },
  { question: 'What are endospores?', answer: 'Endospores are highly resistant dormant structures formed by certain Gram-positive bacteria (Bacillus, Clostridium) under unfavorable conditions. They can withstand extreme heat, UV radiation, desiccation, and chemical disinfectants, and can remain viable for centuries.' },
  { question: 'What is binary fission?', answer: 'Binary fission is the primary method of asexual reproduction in bacteria. The cell replicates its DNA, elongates, and divides into two identical daughter cells. Under optimal conditions, some bacteria can divide every 20 minutes, leading to exponential growth.' },
  { question: 'What are the phases of bacterial growth?', answer: 'The four phases are: (1) Lag phase - bacteria adapt to the environment, no division; (2) Log/exponential phase - rapid, constant-rate division; (3) Stationary phase - growth rate equals death rate due to nutrient depletion; (4) Death/decline phase - cells die faster than they divide.' },
  { question: 'What is a biofilm?', answer: 'A biofilm is a structured community of microorganisms attached to a surface and enclosed in a self-produced matrix of extracellular polymeric substances (EPS). Biofilms are highly resistant to antibiotics and immune defenses, and are implicated in chronic infections and medical device contamination.' },
  { question: 'What is the difference between aerobic and anaerobic bacteria?', answer: 'Aerobic bacteria require oxygen for growth and use it as the terminal electron acceptor in respiration. Anaerobic bacteria cannot grow in the presence of oxygen; obligate anaerobes are killed by it, while facultative anaerobes can switch between aerobic and anaerobic metabolism.' },
  { question: 'What are viruses and how do they differ from bacteria?', answer: 'Viruses are acellular infectious agents consisting of nucleic acid (DNA or RNA) enclosed in a protein coat (capsid). Unlike bacteria, viruses are not cells, cannot reproduce independently, lack metabolic machinery, and must hijack host cell machinery to replicate.' },
  { question: 'What is a bacteriophage?', answer: 'A bacteriophage (phage) is a virus that specifically infects and replicates within bacteria. Phages can undergo lytic cycles (destroying the host) or lysogenic cycles (integrating into the host genome). They are being explored as alternatives to antibiotics in phage therapy.' },
  { question: 'What is the lytic cycle vs the lysogenic cycle?', answer: 'In the lytic cycle, a phage infects a bacterium, hijacks its machinery, replicates, and lyses (bursts) the cell to release new phage particles. In the lysogenic cycle, the phage DNA integrates into the bacterial chromosome as a prophage and replicates passively with the host until triggered to enter the lytic cycle.' },
  { question: 'What is antibiotic resistance?', answer: 'Antibiotic resistance occurs when bacteria evolve mechanisms to survive exposure to antibiotics. Mechanisms include enzymatic drug inactivation (beta-lactamases), altered drug targets, efflux pumps, and reduced permeability. It spreads via horizontal gene transfer and is accelerated by antibiotic misuse.' },
  { question: 'What is horizontal gene transfer?', answer: 'Horizontal gene transfer (HGT) is the movement of genetic material between organisms outside of parent-to-offspring inheritance. In bacteria, the three main mechanisms are transformation (uptake of free DNA), transduction (via bacteriophages), and conjugation (direct transfer via pili).' },
  { question: 'What is conjugation in bacteria?', answer: 'Conjugation is a form of horizontal gene transfer where a donor bacterium transfers DNA (usually a plasmid) to a recipient through a pilus or direct contact. The F (fertility) plasmid encodes the machinery for pilus formation and DNA transfer.' },
  { question: 'What is transformation in microbiology?', answer: 'Transformation is the process by which bacteria take up free DNA from their environment and incorporate it into their genome. Some bacteria are naturally competent (able to take up DNA), while others can be made competent artificially using heat shock or electroporation in the lab.' },
  { question: 'What is transduction?', answer: 'Transduction is the transfer of bacterial DNA from one bacterium to another via a bacteriophage. In generalized transduction, random bacterial DNA fragments are packaged into phage particles. In specialized transduction, specific bacterial genes adjacent to the prophage insertion site are transferred.' },
  { question: 'What are plasmids?', answer: 'Plasmids are small, circular, double-stranded DNA molecules that replicate independently of the bacterial chromosome. They often carry genes for antibiotic resistance, virulence factors, or metabolic capabilities. They are key tools in genetic engineering and biotechnology.' },
  { question: 'What is MRSA?', answer: 'MRSA (Methicillin-Resistant Staphylococcus aureus) is a strain of S. aureus resistant to methicillin and other beta-lactam antibiotics due to the mecA gene, which encodes an altered penicillin-binding protein (PBP2a). MRSA causes difficult-to-treat skin infections, pneumonia, and sepsis.' },
  { question: 'What is PCR and how is it used in microbiology?', answer: 'Polymerase Chain Reaction (PCR) is a technique that amplifies specific DNA sequences exponentially using thermal cycling, primers, and DNA polymerase. In microbiology, it is used for pathogen detection, identification, genotyping, and studying microbial diversity without the need for culturing.' },
  { question: 'What is the human microbiome?', answer: 'The human microbiome refers to the trillions of microorganisms (bacteria, fungi, viruses) that inhabit the human body, particularly the gut, skin, mouth, and urogenital tract. It plays crucial roles in digestion, immune function, vitamin synthesis, and protection against pathogens.' },
  { question: 'What is the difference between sterilization and disinfection?', answer: 'Sterilization destroys all forms of microbial life, including endospores (e.g., autoclaving at 121 C). Disinfection reduces the number of pathogenic microorganisms on surfaces to safe levels but may not eliminate all microbes, especially spores. Antisepsis is disinfection applied to living tissue.' },
  { question: 'What is an autoclave?', answer: 'An autoclave is a device that uses pressurized steam (typically 121 C at 15 psi for 15 minutes) to achieve sterilization. The high temperature and pressure denature proteins and destroy all microorganisms, including endospores. It is the gold standard for sterilizing laboratory equipment and media.' },
  { question: 'What are antibiotics and how do they work?', answer: 'Antibiotics are substances that kill or inhibit the growth of bacteria. They work by targeting essential bacterial processes: cell wall synthesis (penicillins), protein synthesis (tetracyclines, aminoglycosides), nucleic acid synthesis (fluoroquinolones), metabolic pathways (sulfonamides), or cell membrane integrity (polymyxins).' },
  { question: 'What is the difference between bactericidal and bacteriostatic?', answer: 'Bactericidal agents kill bacteria directly (e.g., penicillin, fluoroquinolones). Bacteriostatic agents inhibit bacterial growth without killing, allowing the immune system to clear the infection (e.g., tetracyclines, chloramphenicol). The distinction depends on drug concentration and bacterial species.' },
  { question: 'What are normal flora (normal microbiota)?', answer: 'Normal flora are microorganisms that routinely colonize the body without causing disease. They provide benefits such as competing with pathogens for nutrients and attachment sites, producing vitamins (K, B12), stimulating immune development, and aiding in digestion. They can become opportunistic pathogens if the host is immunocompromised.' },
  { question: 'What is an opportunistic infection?', answer: 'An opportunistic infection is caused by a microorganism that does not normally cause disease in a healthy host but can cause infection when the immune system is compromised (e.g., HIV/AIDS, chemotherapy, organ transplant). Examples include Candida albicans, Pneumocystis jirovecii, and Cryptosporidium.' },
  { question: 'What is the difference between an epidemic and a pandemic?', answer: 'An epidemic is a sudden increase in the number of cases of a disease above what is normally expected in a specific geographic area. A pandemic is an epidemic that has spread across multiple countries or continents, affecting a large number of people. An endemic disease is constantly present in a population.' },
  { question: 'What is herd immunity?', answer: 'Herd immunity occurs when a sufficient proportion of a population is immune to an infectious disease (through vaccination or prior infection), making its spread unlikely and thereby protecting non-immune individuals. The threshold varies by disease (e.g., ~95% for measles, ~80% for polio).' },
  { question: 'What are vaccines and how do they work?', answer: 'Vaccines are biological preparations that stimulate the immune system to recognize and fight specific pathogens without causing disease. Types include live attenuated, inactivated, subunit/conjugate, toxoid, and mRNA vaccines. They generate immunological memory, enabling a rapid response upon subsequent exposure.' },
  { question: 'What is CRISPR-Cas9?', answer: 'CRISPR-Cas9 is a gene-editing tool adapted from a bacterial immune system. Bacteria use CRISPR (Clustered Regularly Interspaced Short Palindromic Repeats) to store viral DNA sequences and Cas9 nuclease to cut matching sequences. Scientists now use it to precisely edit genes in any organism.' },
  { question: 'What are fungi and what diseases do they cause?', answer: 'Fungi are eukaryotic organisms including yeasts (unicellular) and molds (multicellular, filamentous). They cause mycoses ranging from superficial (athlete\'s foot, ringworm) to systemic (histoplasmosis, aspergillosis). Candida albicans causes common mucosal and systemic infections, especially in immunocompromised patients.' },
  { question: 'What are protozoa?', answer: 'Protozoa are single-celled eukaryotic organisms found in diverse environments. Pathogenic protozoa cause diseases like malaria (Plasmodium), sleeping sickness (Trypanosoma), amoebic dysentery (Entamoeba histolytica), giardiasis (Giardia lamblia), and toxoplasmosis (Toxoplasma gondii).' },
  { question: 'What is malaria and how is it transmitted?', answer: 'Malaria is caused by Plasmodium parasites (P. falciparum being most deadly) transmitted through bites of infected female Anopheles mosquitoes. The parasite undergoes complex life cycles in the mosquito and human host, infecting liver cells and red blood cells, causing fever, chills, anemia, and potentially death.' },
  { question: 'What is the difference between innate and adaptive immunity?', answer: 'Innate immunity is the non-specific, immediate defense present from birth, including physical barriers (skin, mucous membranes), phagocytes, complement, and inflammation. Adaptive immunity is specific, develops after exposure, involves T and B lymphocytes, produces antibodies, and generates immunological memory.' },
  { question: 'What are antibodies?', answer: 'Antibodies (immunoglobulins) are Y-shaped proteins produced by B cells/plasma cells that specifically bind to antigens. The five classes are IgG, IgA, IgM, IgD, and IgE. They neutralize pathogens, opsonize them for phagocytosis, activate complement, and prevent pathogen attachment to host cells.' },
  { question: 'What is an antigen?', answer: 'An antigen is any substance that can stimulate an immune response and be recognized by antibodies or T cell receptors. Antigens are typically proteins or polysaccharides found on the surface of pathogens, but can also be toxins, pollen, or transplanted tissue.' },
  { question: 'What is the complement system?', answer: 'The complement system is a cascade of over 30 plasma proteins that enhance (complement) the immune response. It can be activated via classical, alternative, or lectin pathways. Functions include opsonization, inflammation (anaphylatoxins C3a, C5a), and direct lysis of pathogens via the membrane attack complex (MAC).' },
  { question: 'What is an endotoxin vs an exotoxin?', answer: 'Endotoxins are lipopolysaccharide (LPS) components of Gram-negative bacterial outer membranes, released upon cell lysis. They cause fever, inflammation, and septic shock. Exotoxins are proteins actively secreted by bacteria (both Gram-positive and negative), are highly specific and potent (e.g., botulinum toxin, cholera toxin, diphtheria toxin).' },
  { question: 'What is sepsis?', answer: 'Sepsis is a life-threatening condition caused by the body\'s dysregulated immune response to infection. It can lead to widespread inflammation, organ dysfunction, septic shock, and death. It is most commonly caused by bacteria but can result from any infection. Early antibiotic treatment is critical.' },
  { question: 'What is tuberculosis (TB)?', answer: 'Tuberculosis is caused by Mycobacterium tuberculosis, an acid-fast bacillus. It primarily affects the lungs (pulmonary TB) but can spread to other organs. It spreads via respiratory droplets. Latent TB is asymptomatic; active TB causes chronic cough, weight loss, night sweats, and hemoptysis. Treatment requires multi-drug regimens for 6-9 months.' },
  { question: 'What is the acid-fast stain?', answer: 'The acid-fast stain (Ziehl-Neelsen) is used to identify bacteria with mycolic acid-rich cell walls, primarily Mycobacterium species. These bacteria resist decolorization by acid-alcohol after staining with carbolfuchsin. Acid-fast bacteria appear red; non-acid-fast bacteria appear blue with methylene blue counterstain.' },
  { question: 'What are prions?', answer: 'Prions are misfolded proteins (PrPSc) that cause fatal neurodegenerative diseases by inducing normal cellular prion proteins (PrPC) to adopt the abnormal conformation. Prion diseases include Creutzfeldt-Jakob disease (CJD), mad cow disease (BSE), and scrapie. Prions are extremely resistant to heat, radiation, and chemical disinfection.' },
  { question: 'What is the difference between DNA and RNA viruses?', answer: 'DNA viruses (herpesviruses, adenoviruses, poxviruses) use DNA as their genome and typically replicate in the host nucleus. RNA viruses (influenza, HIV, coronaviruses, Ebola) use RNA and often replicate in the cytoplasm. RNA viruses generally mutate faster due to lack of proofreading during replication.' },
  { question: 'What is reverse transcriptase?', answer: 'Reverse transcriptase is an enzyme that synthesizes DNA from an RNA template, reversing the normal flow of genetic information. It is characteristic of retroviruses like HIV. The enzyme is a key target for antiretroviral drugs (e.g., AZT, tenofovir) and is used in molecular biology for creating cDNA libraries.' },
  { question: 'How does HIV cause AIDS?', answer: 'HIV (Human Immunodeficiency Virus) infects CD4+ T helper cells using gp120/gp41 envelope proteins. It reverse-transcribes its RNA genome into DNA, which integrates into the host genome. Over years, progressive destruction of CD4+ cells weakens the immune system, leading to AIDS (Acquired Immunodeficiency Syndrome) when CD4 count drops below 200 cells/uL.' },
  { question: 'What is influenza and why does it require yearly vaccination?', answer: 'Influenza is caused by influenza viruses (types A, B, C). Antigenic drift (minor mutations in hemagglutinin and neuraminidase) creates new strains annually, requiring updated vaccines. Antigenic shift (major genetic reassortment, type A only) can create pandemic strains by combining segments from different species.' },
  { question: 'What are coronaviruses?', answer: 'Coronaviruses are enveloped, positive-sense single-stranded RNA viruses named for their crown-like spike proteins. They cause respiratory and gastrointestinal infections. Notable human coronaviruses include SARS-CoV (2003), MERS-CoV (2012), and SARS-CoV-2 (COVID-19, 2019).' },
  { question: 'What is metagenomics?', answer: 'Metagenomics is the study of genetic material recovered directly from environmental samples, bypassing the need for culturing. It allows analysis of entire microbial communities (microbiomes) and has revealed vast microbial diversity previously unknown. 16S rRNA gene sequencing and shotgun sequencing are common approaches.' },
  { question: 'What is 16S rRNA gene sequencing?', answer: '16S rRNA gene sequencing targets the conserved gene encoding the small ribosomal subunit in prokaryotes. Variable regions within the gene allow species-level identification and phylogenetic analysis. It is widely used for bacterial identification, classification, and microbiome studies as a molecular clock.' },
  { question: 'What is agar and why is it used in microbiology?', answer: 'Agar is a polysaccharide derived from red algae used as a solidifying agent in culture media. It melts at ~85 C and solidifies at ~40 C, remains solid at incubation temperatures, and is not degraded by most bacteria. Common media include nutrient agar, blood agar, MacConkey agar, and chocolate agar.' },
  { question: 'What is a culture medium?', answer: 'A culture medium is a substance containing nutrients needed for microbial growth. Defined media have known chemical composition; complex media contain undefined ingredients (yeast extract, peptone). Selective media favor certain organisms; differential media distinguish between organisms based on biochemical characteristics.' },
  { question: 'What is the difference between selective and differential media?', answer: 'Selective media contain ingredients that inhibit certain organisms while allowing others to grow (e.g., MacConkey agar selects for Gram-negatives). Differential media contain indicators that distinguish organisms by their metabolic activities (e.g., blood agar differentiates hemolytic patterns). Some media are both selective and differential.' },
  { question: 'What is fermentation?', answer: 'Fermentation is an anaerobic metabolic process that converts sugars to acids, gases, or alcohol using organic molecules as electron acceptors instead of oxygen. Types include alcoholic fermentation (yeast producing ethanol and CO2), lactic acid fermentation (Lactobacillus producing yogurt), and mixed acid fermentation.' },
  { question: 'What is the Krebs cycle (citric acid cycle)?', answer: 'The Krebs cycle is a series of metabolic reactions in aerobic organisms that oxidizes acetyl-CoA to CO2, generating NADH, FADH2, and GTP. It occurs in the cytoplasm of prokaryotes and mitochondrial matrix of eukaryotes. It is the central hub connecting carbohydrate, fat, and protein metabolism.' },
  { question: 'What is the electron transport chain?', answer: 'The electron transport chain (ETC) is a series of membrane-bound protein complexes that transfer electrons from NADH and FADH2 to a terminal electron acceptor (oxygen in aerobic respiration). This creates a proton gradient that drives ATP synthesis via ATP synthase (oxidative phosphorylation), producing ~34 ATP per glucose.' },
  { question: 'What is nitrogen fixation?', answer: 'Nitrogen fixation is the conversion of atmospheric N2 into ammonia (NH3) by nitrogenase enzyme, performed by certain bacteria (Rhizobium, Azotobacter, cyanobacteria). It is essential for making nitrogen available to living organisms. Rhizobium forms symbiotic associations with legume root nodules.' },
  { question: 'What is the nitrogen cycle?', answer: 'The nitrogen cycle describes how nitrogen moves through ecosystems. Key steps: nitrogen fixation (N2 to NH3), nitrification (NH3 to NO2- to NO3- by Nitrosomonas and Nitrobacter), assimilation (plants absorb NO3-), ammonification (decomposition releases NH3), and denitrification (NO3- to N2 by Pseudomonas).' },
  { question: 'What is quorum sensing?', answer: 'Quorum sensing is a cell-to-cell communication mechanism in bacteria that depends on population density. Bacteria produce and detect signaling molecules (autoinducers). When a threshold concentration is reached, gene expression changes coordinately, regulating biofilm formation, virulence, bioluminescence, and antibiotic production.' },
  { question: 'What are extremophiles?', answer: 'Extremophiles are organisms that thrive in extreme conditions. Types include thermophiles (high temperatures), psychrophiles (cold), halophiles (high salt), acidophiles (low pH), alkaliphiles (high pH), barophiles (high pressure), and xerophiles (dry conditions). Most are archaea, and they have applications in biotechnology.' },
  { question: 'What are archaea?', answer: 'Archaea are prokaryotic microorganisms that form a separate domain of life from bacteria and eukaryotes. They have unique membrane lipids (ether-linked), lack peptidoglycan, and have distinct ribosomal RNA. Many are extremophiles, but they also inhabit moderate environments including the human gut. None are known to be pathogenic.' },
  { question: 'What is a zoonotic disease?', answer: 'A zoonotic disease is an infectious disease that can be transmitted from animals to humans. Examples include rabies (dogs/bats), Lyme disease (deer ticks), Ebola (bats/primates), avian influenza (birds), plague (rodent fleas), hantavirus (rodents), and COVID-19 (suspected bat origin). About 60% of human infectious diseases are zoonotic.' },
  { question: 'What is Lyme disease?', answer: 'Lyme disease is caused by the spirochete Borrelia burgdorferi, transmitted by Ixodes (black-legged) tick bites. Early symptoms include an expanding bull\'s-eye rash (erythema migrans), fever, and fatigue. If untreated, it can progress to joint inflammation, neurological problems, and cardiac issues. Treatment is with antibiotics like doxycycline.' },
  { question: 'What are spirochetes?', answer: 'Spirochetes are spiral-shaped bacteria with unique internal flagella (axial filaments) that run between the inner and outer membranes. They move in a corkscrew motion. Pathogenic spirochetes include Treponema pallidum (syphilis), Borrelia burgdorferi (Lyme disease), and Leptospira interrogans (leptospirosis).' },
  { question: 'What is cholera?', answer: 'Cholera is an acute diarrheal disease caused by Vibrio cholerae. The bacterium produces cholera toxin, which activates adenylate cyclase in intestinal cells, causing massive secretion of water and electrolytes. This leads to profuse watery diarrhea ("rice-water stool"), dehydration, and potentially death without rehydration therapy.' },
  { question: 'What is the microbiome-gut-brain axis?', answer: 'The microbiome-gut-brain axis is the bidirectional communication between gut microbiota and the brain via neural (vagus nerve), endocrine, immune, and metabolic pathways. Gut bacteria produce neurotransmitters (serotonin, GABA, dopamine) and short-chain fatty acids that influence mood, cognition, and behavior. Dysbiosis is linked to depression, anxiety, and autism.' },
  { question: 'What are bacteriocins?', answer: 'Bacteriocins are antimicrobial peptides produced by bacteria that inhibit or kill closely related bacterial strains. They differ from antibiotics in being ribosomally synthesized and having a narrower spectrum. Nisin, produced by Lactococcus lactis, is widely used as a food preservative.' },
  { question: 'What is ELISA?', answer: 'ELISA (Enzyme-Linked Immunosorbent Assay) is an immunological technique that uses enzyme-linked antibodies to detect and quantify antigens or antibodies in a sample. Types include direct, indirect, sandwich, and competitive ELISA. It is widely used for diagnosing infections (HIV, hepatitis), allergies, and pregnancy tests.' },
  { question: 'What is flow cytometry?', answer: 'Flow cytometry is a technique that analyzes individual cells as they pass through a laser beam in a fluid stream. It measures cell size, complexity, and fluorescence from labeled antibodies or dyes. In microbiology, it is used for cell counting, viability assessment, immunophenotyping, and sorting specific cell populations.' },
  { question: 'What is bioremediation?', answer: 'Bioremediation uses microorganisms to degrade or detoxify environmental pollutants. Bacteria like Pseudomonas can break down petroleum hydrocarbons, pesticides, and heavy metals. Strategies include bioaugmentation (adding specific microbes) and biostimulation (enhancing indigenous microbial activity with nutrients).' },
  { question: 'What is a nosocomial (hospital-acquired) infection?', answer: 'A nosocomial infection is acquired during hospitalization (appearing 48+ hours after admission). Common types include urinary tract infections (catheters), surgical site infections, pneumonia (ventilator-associated), and bloodstream infections (IV lines). Major causative agents include MRSA, C. difficile, Pseudomonas, and Klebsiella.' },
  { question: 'What is Clostridium difficile (C. diff) infection?', answer: 'C. difficile is a spore-forming, toxin-producing anaerobic bacterium that causes antibiotic-associated diarrhea and pseudomembranous colitis. Antibiotics disrupt normal gut flora, allowing C. diff overgrowth. Toxins A and B damage the intestinal lining. Treatment includes metronidazole, vancomycin, or fecal microbiota transplantation.' },
  { question: 'What is fecal microbiota transplantation (FMT)?', answer: 'FMT involves transferring stool from a healthy donor into the gastrointestinal tract of a patient to restore normal gut microbiota. It is highly effective (>90%) for recurrent C. difficile infections and is being investigated for inflammatory bowel disease, obesity, and other conditions linked to dysbiosis.' },
  { question: 'What is antimicrobial susceptibility testing?', answer: 'Antimicrobial susceptibility testing determines which antibiotics effectively inhibit a pathogen. Methods include disk diffusion (Kirby-Bauer), broth dilution (determining MIC - minimum inhibitory concentration), and automated systems (Vitek, MicroScan). Results guide appropriate antibiotic selection for treatment.' },
  { question: 'What is the minimum inhibitory concentration (MIC)?', answer: 'MIC is the lowest concentration of an antimicrobial agent that prevents visible growth of a microorganism after overnight incubation. It is a standard measure of antimicrobial potency. The minimum bactericidal concentration (MBC) is the lowest concentration that kills 99.9% of bacteria.' },
  { question: 'What is food microbiology?', answer: 'Food microbiology studies microorganisms in food production, preservation, and spoilage. Beneficial microbes produce fermented foods (yogurt, cheese, sauerkraut, beer, wine). Pathogenic bacteria (Salmonella, E. coli O157:H7, Listeria, Clostridium botulinum) cause foodborne illness. HACCP systems help ensure food safety.' },
  { question: 'What is Salmonella and how does it cause disease?', answer: 'Salmonella is a Gram-negative, facultatively anaerobic rod that causes salmonellosis (gastroenteritis) and typhoid fever. Non-typhoidal Salmonella typically causes self-limiting diarrhea, fever, and cramps from contaminated poultry, eggs, and produce. S. typhi causes systemic typhoid fever with prolonged high fever, requiring antibiotic treatment.' },
  { question: 'What is E. coli and why are some strains dangerous?', answer: 'Escherichia coli is a Gram-negative rod that is normally a harmless gut commensal. However, pathogenic strains exist: EHEC (O157:H7) produces Shiga toxin causing bloody diarrhea and hemolytic uremic syndrome; ETEC causes traveler\'s diarrhea; UPEC causes urinary tract infections; EIEC causes dysentery-like illness.' },
  { question: 'What is a capsule in bacteria?', answer: 'A bacterial capsule is a well-organized, firmly attached polysaccharide or polypeptide layer outside the cell wall. It provides protection against phagocytosis, aids in biofilm formation, prevents desiccation, and is a major virulence factor. Encapsulated bacteria (Streptococcus pneumoniae, Klebsiella, Haemophilus) are often more pathogenic.' },
  { question: 'What are flagella and what is chemotaxis?', answer: 'Flagella are long, whip-like appendages that provide motility to bacteria. They are powered by a rotary motor at the base (proton motive force). Chemotaxis is the directed movement of bacteria toward attractants (nutrients) or away from repellents (toxins), guided by chemoreceptors and signal transduction pathways.' },
  { question: 'What are pili (fimbriae)?', answer: 'Pili are thin, hair-like protein appendages on bacterial surfaces. Common pili (fimbriae) mediate adhesion to host cells and surfaces, which is crucial for colonization and biofilm formation. Sex pili (F pili) are longer and used in conjugation for DNA transfer between bacteria.' },
  { question: 'What is recombinant DNA technology?', answer: 'Recombinant DNA technology involves combining DNA from different sources to create new genetic combinations. Key tools include restriction enzymes (cut DNA at specific sequences), ligases (join DNA fragments), vectors (plasmids, phages for carrying DNA), and host cells (E. coli) for cloning and expression. Applications include insulin production and gene therapy.' },
  { question: 'What are restriction enzymes?', answer: 'Restriction enzymes (restriction endonucleases) are bacterial enzymes that cut DNA at specific recognition sequences (typically 4-8 base pairs, palindromic). Bacteria use them as a defense against phage DNA. In biotechnology, they are essential tools for cloning, mapping, and genetic engineering (e.g., EcoRI, BamHI, HindIII).' },
  { question: 'What is gel electrophoresis?', answer: 'Gel electrophoresis separates DNA, RNA, or proteins by size using an electric field through an agarose or polyacrylamide gel matrix. Smaller molecules migrate faster. In microbiology, it is used for analyzing PCR products, restriction fragments, plasmids, and for techniques like PFGE (pulsed-field gel electrophoresis) for epidemiological typing.' },
  { question: 'What is FISH (Fluorescence In Situ Hybridization)?', answer: 'FISH uses fluorescently labeled DNA probes that bind to complementary sequences in intact cells, allowing visualization under fluorescence microscopy. In microbiology, it identifies and localizes specific microorganisms in environmental or clinical samples without culturing, often targeting 16S rRNA for bacterial identification.' },
  { question: 'What is the difference between commensalism, mutualism, and parasitism?', answer: 'Commensalism benefits one organism without affecting the other (e.g., normal skin flora). Mutualism benefits both organisms (e.g., gut bacteria producing vitamins for the host while receiving nutrients). Parasitism benefits one organism at the expense of the other (e.g., pathogenic infections).' },
  { question: 'What are mycotoxins?', answer: 'Mycotoxins are toxic secondary metabolites produced by fungi (molds) that contaminate food and feed. Major mycotoxins include aflatoxins (Aspergillus - potent carcinogens), ochratoxin (Aspergillus/Penicillium - kidney damage), and ergot alkaloids (Claviceps - ergotism). They cause mycotoxicoses ranging from acute poisoning to chronic diseases and cancer.' },
  { question: 'What is the role of microorganisms in the carbon cycle?', answer: 'Microorganisms are essential in the carbon cycle. Photosynthetic microbes (cyanobacteria, algae) fix CO2 into organic carbon. Decomposers (bacteria, fungi) break down dead organic matter, releasing CO2 through respiration. Methanogens produce methane (CH4), while methanotrophs oxidize it. These processes regulate atmospheric CO2 and global climate.' },
  { question: 'What is a viroid?', answer: 'Viroids are small, circular, single-stranded RNA molecules that cause diseases in plants. They are the smallest known infectious agents (246-401 nucleotides), lack a protein coat, and do not encode any proteins. They replicate in the host cell nucleus using host RNA polymerase. Examples include potato spindle tuber viroid.' },
  { question: 'What is lysogeny?', answer: 'Lysogeny is the integration of bacteriophage DNA (prophage) into the host bacterial chromosome, where it replicates passively with each cell division. The bacterium is called a lysogen. Prophages can confer new properties to the host (lysogenic conversion), such as toxin production (e.g., diphtheria toxin, Shiga toxin).' },
  { question: 'What is an obligate intracellular parasite?', answer: 'An obligate intracellular parasite can only reproduce inside host cells because it lacks essential metabolic machinery. Viruses are the most common examples. Among bacteria, Chlamydia and Rickettsia are obligate intracellular parasites, requiring host cell ATP or other metabolites. This makes them difficult to culture on standard media.' },
  { question: 'What is the difference between a toxin and a toxoid?', answer: 'A toxin is a harmful substance produced by a microorganism (exotoxin or endotoxin) that damages host tissues. A toxoid is a chemically or heat-inactivated toxin that has lost its toxicity but retains its antigenicity (ability to stimulate immune response). Toxoids are used in vaccines, such as diphtheria and tetanus toxoid vaccines.' },
  { question: 'What is Helicobacter pylori?', answer: 'H. pylori is a spiral-shaped, microaerophilic, Gram-negative bacterium that colonizes the human stomach. It produces urease to neutralize stomach acid, creating a habitable microenvironment. It causes chronic gastritis, peptic ulcers, and is classified as a Group 1 carcinogen for gastric cancer and MALT lymphoma. Treatment involves triple therapy (PPI + two antibiotics).' },
  { question: 'What is a superantigen?', answer: 'Superantigens are microbial proteins that bypass normal antigen processing and directly cross-link MHC class II molecules with T cell receptors, activating up to 20% of all T cells simultaneously. This causes massive cytokine release ("cytokine storm"), leading to toxic shock syndrome. Examples include TSST-1 (S. aureus) and streptococcal pyrogenic exotoxins.' },
  { question: 'What is the minimum infective dose?', answer: 'The minimum infective dose (MID) is the smallest number of microorganisms required to establish an infection. It varies greatly: Shigella requires as few as 10-100 organisms, while Salmonella typically requires 100,000+. Factors include the pathogen\'s virulence, route of entry, and the host\'s immune status.' },
  { question: 'What are interferons?', answer: 'Interferons are cytokines produced by host cells in response to viral infection and other stimuli. Type I interferons (IFN-alpha, IFN-beta) induce an antiviral state in neighboring cells by upregulating antiviral proteins. Type II (IFN-gamma) activates macrophages and enhances antigen presentation. They are part of innate immunity and used therapeutically.' },
  { question: 'What is antigenic variation?', answer: 'Antigenic variation is a mechanism by which pathogens alter their surface proteins to evade the host immune system. Examples include influenza virus antigenic drift/shift, Trypanosoma brucei variant surface glycoprotein (VSG) switching, Plasmodium falciparum var gene expression, and Neisseria gonorrhoeae pili variation.' },
  { question: 'What is an SOS response in bacteria?', answer: 'The SOS response is a global DNA repair system activated when bacteria detect significant DNA damage. It is regulated by RecA and LexA proteins. When triggered, it upregulates error-prone DNA polymerases that can bypass lesions, potentially introducing mutations. This can accelerate evolution and contribute to antibiotic resistance development.' },
  { question: 'What is whole genome sequencing (WGS) in microbiology?', answer: 'WGS determines the complete DNA sequence of a microorganism\'s genome. In microbiology, it is used for pathogen identification, outbreak investigation (tracking transmission), antimicrobial resistance gene detection, virulence factor identification, and evolutionary studies. Next-generation sequencing technologies have made WGS routine in public health labs.' },
];

var styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
  },
  backLink: {
    color: '#7eb8ff',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'inline-block',
    marginBottom: '20px',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    color: '#ffffff',
    marginBottom: '10px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    fontSize: '14px',
    marginBottom: '24px',
  },
  wrapper: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  searchInput: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
    marginBottom: '20px',
    boxSizing: 'border-box',
  },
  faqItem: {
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '12px',
    marginBottom: '10px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'border-color 0.2s',
  },
  faqItemActive: {
    borderColor: 'rgba(124,77,255,0.4)',
  },
  faqHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 20px',
    cursor: 'pointer',
    gap: '12px',
  },
  faqQuestion: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#e0e0e0',
    flex: '1',
  },
  faqIcon: {
    fontSize: '20px',
    color: '#7c4dff',
    transition: 'transform 0.3s',
    flexShrink: 0,
  },
  faqIconOpen: {
    transform: 'rotate(180deg)',
  },
  faqBody: {
    overflow: 'hidden',
    transition: 'max-height 0.3s ease, padding 0.3s ease',
  },
  faqAnswer: {
    padding: '0 20px 18px',
    fontSize: '14px',
    lineHeight: '1.7',
    color: '#aaa',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    padding: '30px',
    fontSize: '15px',
  },
};

function App() {
  var _openId = useState(null);
  var openId = _openId[0], setOpenId = _openId[1];
  var _search = useState('');
  var search = _search[0], setSearch = _search[1];

  function toggleFaq(idx) {
    setOpenId(openId === idx ? null : idx);
  }

  var filtered = faqData.filter(function (faq) {
    if (!search) return true;
    var q = search.toLowerCase();
    return faq.question.toLowerCase().indexOf(q) !== -1 ||
           faq.answer.toLowerCase().indexOf(q) !== -1;
  });

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, '\u2753 Microbiology FAQ'),
    React.createElement('p', { style: styles.subtitle }, 'Top 100 Microbiology Questions & Answers'),
    React.createElement('div', { style: styles.wrapper },
      React.createElement('input', {
        style: styles.searchInput,
        value: search,
        onChange: function (e) { setSearch(e.target.value); },
        placeholder: 'Search microbiology questions...',
      }),
      filtered.length === 0
        ? React.createElement('div', { style: styles.noResults }, 'No matching FAQs found')
        : filtered.map(function (faq, idx) {
            var originalIdx = faqData.indexOf(faq);
            var isOpen = openId === originalIdx;
            return React.createElement('div', {
              key: originalIdx,
              style: Object.assign({}, styles.faqItem, isOpen ? styles.faqItemActive : {}),
            },
              React.createElement('div', {
                style: styles.faqHeader,
                onClick: function () { toggleFaq(originalIdx); },
              },
                React.createElement('span', { style: styles.faqQuestion }, faq.question),
                React.createElement('span', {
                  style: Object.assign({}, styles.faqIcon, isOpen ? styles.faqIconOpen : {}),
                }, '\u25BC')
              ),
              React.createElement('div', {
                style: Object.assign({}, styles.faqBody, {
                  maxHeight: isOpen ? '500px' : '0px',
                  padding: isOpen ? undefined : '0',
                }),
              },
                React.createElement('div', { style: styles.faqAnswer }, faq.answer)
              )
            );
          })
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
