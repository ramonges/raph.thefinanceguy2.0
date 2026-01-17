export type CompanyType = 'bank' | 'fund'

export interface Company {
  name: string
  website: string
  city: string
  region: string
  type: CompanyType
}

export interface CompanyLocation {
  region: string
  cities: {
    city: string
    companies: Company[]
  }[]
}

// Helper function to get website URL for a company
function getWebsite(companyName: string): string {
  // Map of company names to their websites
  const companyWebsites: Record<string, string> = {
    // Banks
    'Goldman Sachs': 'https://www.goldmansachs.com',
    'JPMorgan Chase': 'https://www.jpmorgan.com',
    'Morgan Stanley': 'https://www.morganstanley.com',
    'Bank of America': 'https://www.bankofamerica.com',
    'Citigroup': 'https://www.citigroup.com',
    'Wells Fargo': 'https://www.wellsfargo.com',
    'HSBC': 'https://www.hsbc.com',
    'Barclays': 'https://www.barclays.com',
    'UBS': 'https://www.ubs.com',
    'Deutsche Bank': 'https://www.db.com',
    'CME Group': 'https://www.cmegroup.com',
    'Royal Bank of Canada': 'https://www.rbc.com',
    'Toronto-Dominion Bank': 'https://www.td.com',
    'Bank of Nova Scotia': 'https://www.scotiabank.com',
    'Bank of Montreal': 'https://www.bmo.com',
    'Canadian Imperial Bank of Commerce': 'https://www.cibc.com',
    'National Bank of Canada': 'https://www.nbc.ca',
    'Lloyds Banking Group': 'https://www.lloydsbankinggroup.com',
    'Standard Chartered': 'https://www.sc.com',
    'BNP Paribas': 'https://www.bnpparibas.com',
    'Société Générale': 'https://www.societegenerale.com',
    'Crédit Agricole': 'https://www.credit-agricole.com',
    'NatWest Markets': 'https://www.natwestmarkets.com',
    'Commerzbank': 'https://www.commerzbank.com',
    'ING': 'https://www.ing.com',
    'Rabobank': 'https://www.rabobank.com',
    'ABN AMRO': 'https://www.abnamro.com',
    'UniCredit': 'https://www.unicreditgroup.eu',
    'Intesa Sanpaolo': 'https://www.intesasanpaolo.com',
    'Santander': 'https://www.santander.com',
    'BBVA': 'https://www.bbva.com',
    'Bank of China': 'https://www.boc.cn',
    'ICBC': 'https://www.icbc.com.cn',
    'China Construction Bank': 'https://www.ccb.com',
    'CITIC Securities': 'https://www.citics.com',
    'Nomura': 'https://www.nomura.com',
    'Mitsubishi UFJ Financial Group': 'https://www.mufg.jp',
    'MUFG': 'https://www.mufg.jp',
    'Sumitomo Mitsui': 'https://www.smbc.co.jp',
    'SMBC': 'https://www.smbc.co.jp',
    'Mizuho': 'https://www.mizuho-fg.co.jp',
    'DBS': 'https://www.dbs.com',
    'OCBC': 'https://www.ocbc.com',
    'UOB': 'https://www.uob.com.sg',
    'Macquarie': 'https://www.macquarie.com',
    'Commonwealth Bank': 'https://www.commbank.com.au',
    'Westpac': 'https://www.westpac.com.au',
    'ANZ': 'https://www.anz.com',
    'Emirates NBD': 'https://www.emiratesnbd.com',
    'First Abu Dhabi Bank': 'https://www.bankfab.com',
    'Standard Bank': 'https://www.standardbank.com',
    'Absa': 'https://www.absa.africa',
    'Nedbank': 'https://www.nedbank.co.za',
    'Investec': 'https://www.investec.com',
    
    // Funds (keeping existing fund websites)
    '3Red Partners': 'https://www.3redpartners.com',
    'All Options': 'https://www.alloptions.nl',
    'Balyasny Asset Management (BAM)': 'https://www.bamfunds.com',
    'DRW': 'https://www.drw.com',
    'Great Point Capital': 'https://www.greatpointcapital.com',
    'Headlands Technology': 'https://www.headlandstech.com',
    'Hudson River Trading': 'https://www.hudsonrivertrading.com',
    'Jump Trading': 'https://www.jumptrading.com',
    'Kershner Trading Group': 'https://www.kershnertrading.com/#/',
    'PEAK6': 'https://www.peak6.com',
    'Quantlab': 'https://www.quantlab.com',
    'VIRTU Financial': 'https://www.virtu.com',
    'XR Trading': 'https://www.xrtrading.com',
    'DV Trading': 'https://dvtrading.co/',
    'The Voleon Group': 'https://www.voleon.com',
    'D. E. Shaw': 'https://www.deshaw.com',
    'Squarepoint Capital': 'https://www.squarepoint-capital.com',
    'Akuna Capital': 'https://www.akunacapital.com',
    'AlphaGrep': 'https://www.alphagrep.com',
    'Aquatic': 'https://www.aquatic.com/',
    'Belvedere Trading': 'https://www.belvederetrading.com',
    'BlackEdge Capital': 'https://www.blackedgecapital.com',
    'Chicago Trading Company': 'https://www.chicagotrading.com',
    'Consolidated Trading': 'http://prod.consolidatedtrading.com/',
    'Eagle Seven': 'https://www.eagleseven.com',
    'Eclipse Trading': 'https://www.eclipsetrading.com',
    'Flow Traders': 'https://www.flowtraders.com',
    'Gelber Group': 'https://www.gelbergroup.com',
    'Geneva Trading': 'https://www.genevatrading.com',
    'IMC Trading': 'https://www.imc.com',
    'League Trading': 'http://theleaguecorp.com/',
    'Marquette Partners': 'https://www.marquettepartnersholdingsllc.com/',
    'Matrix Executions': 'https://www.matrixexecutions.com',
    'Maven Securities': 'https://www.mavensecurities.com',
    'Old Mission Capital': 'https://www.oldmissioncapital.com',
    'Prime Trading': 'https://www.prime-trading.com/',
    'Radix Trading': 'https://www.radixtrading.com',
    'SCALP Trade': 'https://www.scalptrade.com',
    'SIG': 'https://www.sig.com',
    'Simplex Trading': 'https://www.simplextrading.com',
    'Sumo': 'https://sumo.co/',
    'Tower Research Capital': 'https://www.tower-research.com',
    'TradeLink': 'https://tradelinkllc.com/',
    'TransMarket Group': 'https://www.transmarketgroup.com',
    'Trillium Trading': 'https://www.trlm.com/',
    'Two Sigma': 'https://www.twosigma.com',
    'Valkyrie Trading': 'https://www.valkyrietrading.com',
    'WH Trading': 'https://www.whtrading.com',
    'Wolverine Trading': 'https://www.wolve.com/',
    'WorldQuant': 'https://www.worldquant.com',
    'AQR Capital Management': 'https://www.aqr.com',
    'Da Vinci Trading': 'https://www.davincitrading.com',
    'Black Eagle Financial Group': 'https://blackeaglefg.com/',
    'ACT Group': 'https://www.actgroup.com',
    'Ansatz Capital': 'https://ansatz.capital/',
    'Arrowstreet Capital': 'https://www.arrowstreetcapital.com',
    'Chimera Securities': 'https://www.chimerasecurities.com',
    'Cubist (Point72)': 'https://www.point72.com',
    'Epoch Capital': 'https://epoch.capital/',
    'Five Rings': 'https://www.fiverings.com',
    'HAP Capital': 'https://www.hapcapital.com',
    'Jane Street': 'https://www.janestreet.com',
    'Keyrock': 'https://www.keyrock.eu',
    'Kronos Research': 'https://www.kronosresearch.com',
    'Marshall Wace': 'https://www.mwam.com/',
    'Millenium': 'https://www.mlp.com',
    'OTC Flow': 'https://www.otcflow.com',
    'Quadeye': 'https://www.quadeye.com',
    'Seven Eight Capital': 'https://www.seveneightcapital.com',
    'Seven Points Capital': 'https://www.sevenpointscapital.com',
    'T3 Trading Group': 'https://www.t3trading.com',
    'Vatic Labs': 'https://www.vaticlabs.com',
    'XTX Markets': 'https://www.xtxmarkets.com',
    'Trexquant': 'https://www.trexquant.com',
    '323 Trading': 'https://323trading.nl/',
    'Algorithmic Trading Group': 'https://www.algorithmictradinggroup.com/',
    'Barak Capital': 'https://www.barakcapital.com',
    'BlockTech': 'https://www.blocktech.com',
    'Criterion Arbitrage & Trading': 'https://www.criterion-trading.nl/',
    'Cross Options': 'https://www.crossoptions.net/',
    'Deep Blue Capital': 'https://deepbluecap.com/',
    'Mako Trading': 'https://www.mako.com/',
    'Market Wizards': 'https://www.marketwizards.com',
    'Mathrix': 'https://www.mathrix.com',
    'Maverick Derivatives': 'https://www.maverickderivatives.com',
    'Nino Options': 'https://www.nino-options.nl/',
    'Northpool': 'https://www.nordpoolgroup.com/',
    'Nyenburgh': 'https://www.nyenburgh.com',
    'ORA Traders': 'https://www.oratraders.com',
    'Priogen Energy': 'https://priogen.com/',
    'VivCourt Trading': 'https://www.vivcourttrading.com',
    'WEBB Traders': 'https://www.webbtraders.com',
    'UTR8 Group': 'https://www.utr8group.com',
    'Wincent': 'https://www.wincent.com',
    'Quantbox Research': 'https://www.quantboxresearch.com',
    'Z.R.T.X.': 'https://www.zrtx.eu/',
    'Amplify Trading': 'https://www.amplifytrading.com',
    'B2C2': 'https://www.b2c2.com',
    'G-Research': 'https://www.gresearch.com',
    'GSR': 'https://www.gsr.io',
    'Jerpoint Capital': 'https://www.jerpointcapital.com',
    'OSTC Ltd.': 'https://www.ostc.com',
    'Tibra': 'https://www.tibra.com',
    'Wintermute': 'https://www.wintermute.com',
    'XY Capital': 'https://www.xycapitalgroup.com/',
    'KeyQuant': 'https://www.keyquant.com',
    'Woorton': 'https://www.woorton.com',
    'Gravity Team': 'https://gravityteam.co/',
    'Domstad Traders': 'https://domstadbeheer.nl/',
    'Amber Group': 'https://www.ambergroup.io/',
    'Liquid Capital Group': 'https://liquidcapitalcorp.com/',
    'Nine Mile': 'https://www.nmftrading.com/',
    'Genk Capital': 'https://www.genkcapital.com',
    'Graviton Research Capital': 'https://www.gravitonresearch.com',
    'NK Securities': 'https://www.nksecurities.com',
    '26 Miles Capital': 'https://www.26milescapital.com',
    'Statar Capital': 'https://www.statarcapital.com/',
  }

  // Return the website if found, otherwise use a generic search URL
  return companyWebsites[companyName] || `https://www.google.com/search?q=${encodeURIComponent(companyName)}`
}

// Banks data organized by region and city
export const banksData: CompanyLocation[] = [
  {
    region: 'North America',
    cities: [
      {
        city: 'New York City',
        companies: [
          { name: 'Goldman Sachs', website: getWebsite('Goldman Sachs'), city: 'New York City', region: 'North America', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'New York City', region: 'North America', type: 'bank' },
          { name: 'Morgan Stanley', website: getWebsite('Morgan Stanley'), city: 'New York City', region: 'North America', type: 'bank' },
          { name: 'Bank of America', website: getWebsite('Bank of America'), city: 'New York City', region: 'North America', type: 'bank' },
          { name: 'Citigroup', website: getWebsite('Citigroup'), city: 'New York City', region: 'North America', type: 'bank' },
          { name: 'Wells Fargo', website: getWebsite('Wells Fargo'), city: 'New York City', region: 'North America', type: 'bank' },
          { name: 'HSBC', website: getWebsite('HSBC'), city: 'New York City', region: 'North America', type: 'bank' },
          { name: 'Barclays', website: getWebsite('Barclays'), city: 'New York City', region: 'North America', type: 'bank' },
          { name: 'UBS', website: getWebsite('UBS'), city: 'New York City', region: 'North America', type: 'bank' },
          { name: 'Deutsche Bank', website: getWebsite('Deutsche Bank'), city: 'New York City', region: 'North America', type: 'bank' },
        ]
      },
      {
        city: 'Chicago',
        companies: [
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'Chicago', region: 'North America', type: 'bank' },
          { name: 'Citigroup', website: getWebsite('Citigroup'), city: 'Chicago', region: 'North America', type: 'bank' },
          { name: 'Goldman Sachs', website: getWebsite('Goldman Sachs'), city: 'Chicago', region: 'North America', type: 'bank' },
          { name: 'Bank of America', website: getWebsite('Bank of America'), city: 'Chicago', region: 'North America', type: 'bank' },
          { name: 'Wells Fargo', website: getWebsite('Wells Fargo'), city: 'Chicago', region: 'North America', type: 'bank' },
          { name: 'CME Group', website: getWebsite('CME Group'), city: 'Chicago', region: 'North America', type: 'bank' },
        ]
      },
      {
        city: 'San Francisco',
        companies: [
          { name: 'Bank of America', website: getWebsite('Bank of America'), city: 'San Francisco', region: 'North America', type: 'bank' },
          { name: 'Citigroup', website: getWebsite('Citigroup'), city: 'San Francisco', region: 'North America', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'San Francisco', region: 'North America', type: 'bank' },
        ]
      },
      {
        city: 'Toronto',
        companies: [
          { name: 'Royal Bank of Canada', website: getWebsite('Royal Bank of Canada'), city: 'Toronto', region: 'North America', type: 'bank' },
          { name: 'Toronto-Dominion Bank', website: getWebsite('Toronto-Dominion Bank'), city: 'Toronto', region: 'North America', type: 'bank' },
          { name: 'Bank of Nova Scotia', website: getWebsite('Bank of Nova Scotia'), city: 'Toronto', region: 'North America', type: 'bank' },
          { name: 'Bank of Montreal', website: getWebsite('Bank of Montreal'), city: 'Toronto', region: 'North America', type: 'bank' },
          { name: 'Canadian Imperial Bank of Commerce', website: getWebsite('Canadian Imperial Bank of Commerce'), city: 'Toronto', region: 'North America', type: 'bank' },
          { name: 'National Bank of Canada', website: getWebsite('National Bank of Canada'), city: 'Toronto', region: 'North America', type: 'bank' },
        ]
      },
    ]
  },
  {
    region: 'Europe',
    cities: [
      {
        city: 'London',
        companies: [
          { name: 'HSBC', website: getWebsite('HSBC'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'Barclays', website: getWebsite('Barclays'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'Lloyds Banking Group', website: getWebsite('Lloyds Banking Group'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'Standard Chartered', website: getWebsite('Standard Chartered'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'Goldman Sachs', website: getWebsite('Goldman Sachs'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'Morgan Stanley', website: getWebsite('Morgan Stanley'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'Bank of America', website: getWebsite('Bank of America'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'Citigroup', website: getWebsite('Citigroup'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'Deutsche Bank', website: getWebsite('Deutsche Bank'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'UBS', website: getWebsite('UBS'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'BNP Paribas', website: getWebsite('BNP Paribas'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'Société Générale', website: getWebsite('Société Générale'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'Crédit Agricole', website: getWebsite('Crédit Agricole'), city: 'London', region: 'Europe', type: 'bank' },
          { name: 'NatWest Markets', website: getWebsite('NatWest Markets'), city: 'London', region: 'Europe', type: 'bank' },
        ]
      },
      {
        city: 'Frankfurt',
        companies: [
          { name: 'Deutsche Bank', website: getWebsite('Deutsche Bank'), city: 'Frankfurt', region: 'Europe', type: 'bank' },
          { name: 'Commerzbank', website: getWebsite('Commerzbank'), city: 'Frankfurt', region: 'Europe', type: 'bank' },
          { name: 'Barclays', website: getWebsite('Barclays'), city: 'Frankfurt', region: 'Europe', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'Frankfurt', region: 'Europe', type: 'bank' },
          { name: 'Goldman Sachs', website: getWebsite('Goldman Sachs'), city: 'Frankfurt', region: 'Europe', type: 'bank' },
          { name: 'Citigroup', website: getWebsite('Citigroup'), city: 'Frankfurt', region: 'Europe', type: 'bank' },
          { name: 'BNP Paribas', website: getWebsite('BNP Paribas'), city: 'Frankfurt', region: 'Europe', type: 'bank' },
          { name: 'UBS', website: getWebsite('UBS'), city: 'Frankfurt', region: 'Europe', type: 'bank' },
        ]
      },
      {
        city: 'Paris',
        companies: [
          { name: 'BNP Paribas', website: getWebsite('BNP Paribas'), city: 'Paris', region: 'Europe', type: 'bank' },
          { name: 'Société Générale', website: getWebsite('Société Générale'), city: 'Paris', region: 'Europe', type: 'bank' },
          { name: 'Crédit Agricole', website: getWebsite('Crédit Agricole'), city: 'Paris', region: 'Europe', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'Paris', region: 'Europe', type: 'bank' },
          { name: 'Goldman Sachs', website: getWebsite('Goldman Sachs'), city: 'Paris', region: 'Europe', type: 'bank' },
          { name: 'Barclays', website: getWebsite('Barclays'), city: 'Paris', region: 'Europe', type: 'bank' },
        ]
      },
      {
        city: 'Zurich',
        companies: [
          { name: 'UBS', website: getWebsite('UBS'), city: 'Zurich', region: 'Europe', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'Zurich', region: 'Europe', type: 'bank' },
          { name: 'Goldman Sachs', website: getWebsite('Goldman Sachs'), city: 'Zurich', region: 'Europe', type: 'bank' },
          { name: 'Deutsche Bank', website: getWebsite('Deutsche Bank'), city: 'Zurich', region: 'Europe', type: 'bank' },
        ]
      },
      {
        city: 'Amsterdam',
        companies: [
          { name: 'ING', website: getWebsite('ING'), city: 'Amsterdam', region: 'Europe', type: 'bank' },
          { name: 'Rabobank', website: getWebsite('Rabobank'), city: 'Amsterdam', region: 'Europe', type: 'bank' },
          { name: 'ABN AMRO', website: getWebsite('ABN AMRO'), city: 'Amsterdam', region: 'Europe', type: 'bank' },
        ]
      },
      {
        city: 'Brussels',
        companies: [
          { name: 'BNP Paribas', website: getWebsite('BNP Paribas'), city: 'Brussels', region: 'Europe', type: 'bank' },
        ]
      },
      {
        city: 'Milan',
        companies: [
          { name: 'UniCredit', website: getWebsite('UniCredit'), city: 'Milan', region: 'Europe', type: 'bank' },
          { name: 'Intesa Sanpaolo', website: getWebsite('Intesa Sanpaolo'), city: 'Milan', region: 'Europe', type: 'bank' },
        ]
      },
      {
        city: 'Madrid',
        companies: [
          { name: 'Santander', website: getWebsite('Santander'), city: 'Madrid', region: 'Europe', type: 'bank' },
          { name: 'BBVA', website: getWebsite('BBVA'), city: 'Madrid', region: 'Europe', type: 'bank' },
        ]
      },
    ]
  },
  {
    region: 'Asia Pacific',
    cities: [
      {
        city: 'Hong Kong',
        companies: [
          { name: 'HSBC', website: getWebsite('HSBC'), city: 'Hong Kong', region: 'Asia Pacific', type: 'bank' },
          { name: 'Standard Chartered', website: getWebsite('Standard Chartered'), city: 'Hong Kong', region: 'Asia Pacific', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'Hong Kong', region: 'Asia Pacific', type: 'bank' },
          { name: 'Goldman Sachs', website: getWebsite('Goldman Sachs'), city: 'Hong Kong', region: 'Asia Pacific', type: 'bank' },
          { name: 'Citigroup', website: getWebsite('Citigroup'), city: 'Hong Kong', region: 'Asia Pacific', type: 'bank' },
          { name: 'Bank of China', website: getWebsite('Bank of China'), city: 'Hong Kong', region: 'Asia Pacific', type: 'bank' },
          { name: 'UBS', website: getWebsite('UBS'), city: 'Hong Kong', region: 'Asia Pacific', type: 'bank' },
          { name: 'Nomura', website: getWebsite('Nomura'), city: 'Hong Kong', region: 'Asia Pacific', type: 'bank' },
          { name: 'Mitsubishi UFJ Financial Group', website: getWebsite('MUFG'), city: 'Hong Kong', region: 'Asia Pacific', type: 'bank' },
          { name: 'Sumitomo Mitsui', website: getWebsite('SMBC'), city: 'Hong Kong', region: 'Asia Pacific', type: 'bank' },
          { name: 'Mizuho', website: getWebsite('Mizuho'), city: 'Hong Kong', region: 'Asia Pacific', type: 'bank' },
        ]
      },
      {
        city: 'Singapore',
        companies: [
          { name: 'DBS', website: getWebsite('DBS'), city: 'Singapore', region: 'Asia Pacific', type: 'bank' },
          { name: 'OCBC', website: getWebsite('OCBC'), city: 'Singapore', region: 'Asia Pacific', type: 'bank' },
          { name: 'UOB', website: getWebsite('UOB'), city: 'Singapore', region: 'Asia Pacific', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'Singapore', region: 'Asia Pacific', type: 'bank' },
          { name: 'Goldman Sachs', website: getWebsite('Goldman Sachs'), city: 'Singapore', region: 'Asia Pacific', type: 'bank' },
          { name: 'Citigroup', website: getWebsite('Citigroup'), city: 'Singapore', region: 'Asia Pacific', type: 'bank' },
          { name: 'HSBC', website: getWebsite('HSBC'), city: 'Singapore', region: 'Asia Pacific', type: 'bank' },
          { name: 'Standard Chartered', website: getWebsite('Standard Chartered'), city: 'Singapore', region: 'Asia Pacific', type: 'bank' },
          { name: 'UBS', website: getWebsite('UBS'), city: 'Singapore', region: 'Asia Pacific', type: 'bank' },
          { name: 'Nomura', website: getWebsite('Nomura'), city: 'Singapore', region: 'Asia Pacific', type: 'bank' },
          { name: 'Mitsubishi UFJ Financial Group', website: getWebsite('MUFG'), city: 'Singapore', region: 'Asia Pacific', type: 'bank' },
        ]
      },
      {
        city: 'Tokyo',
        companies: [
          { name: 'Nomura', website: getWebsite('Nomura'), city: 'Tokyo', region: 'Asia Pacific', type: 'bank' },
          { name: 'Mitsubishi UFJ Financial Group', website: getWebsite('MUFG'), city: 'Tokyo', region: 'Asia Pacific', type: 'bank' },
          { name: 'Sumitomo Mitsui', website: getWebsite('SMBC'), city: 'Tokyo', region: 'Asia Pacific', type: 'bank' },
          { name: 'Mizuho', website: getWebsite('Mizuho'), city: 'Tokyo', region: 'Asia Pacific', type: 'bank' },
          { name: 'Goldman Sachs', website: getWebsite('Goldman Sachs'), city: 'Tokyo', region: 'Asia Pacific', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'Tokyo', region: 'Asia Pacific', type: 'bank' },
          { name: 'Citigroup', website: getWebsite('Citigroup'), city: 'Tokyo', region: 'Asia Pacific', type: 'bank' },
          { name: 'UBS', website: getWebsite('UBS'), city: 'Tokyo', region: 'Asia Pacific', type: 'bank' },
        ]
      },
      {
        city: 'Shanghai',
        companies: [
          { name: 'Bank of China', website: getWebsite('Bank of China'), city: 'Shanghai', region: 'Asia Pacific', type: 'bank' },
          { name: 'ICBC', website: getWebsite('ICBC'), city: 'Shanghai', region: 'Asia Pacific', type: 'bank' },
          { name: 'China Construction Bank', website: getWebsite('China Construction Bank'), city: 'Shanghai', region: 'Asia Pacific', type: 'bank' },
          { name: 'CITIC Securities', website: getWebsite('CITIC Securities'), city: 'Shanghai', region: 'Asia Pacific', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'Shanghai', region: 'Asia Pacific', type: 'bank' },
          { name: 'Goldman Sachs', website: getWebsite('Goldman Sachs'), city: 'Shanghai', region: 'Asia Pacific', type: 'bank' },
        ]
      },
      {
        city: 'Beijing',
        companies: [
          { name: 'Bank of China', website: getWebsite('Bank of China'), city: 'Beijing', region: 'Asia Pacific', type: 'bank' },
          { name: 'ICBC', website: getWebsite('ICBC'), city: 'Beijing', region: 'Asia Pacific', type: 'bank' },
          { name: 'China Construction Bank', website: getWebsite('China Construction Bank'), city: 'Beijing', region: 'Asia Pacific', type: 'bank' },
          { name: 'CITIC Securities', website: getWebsite('CITIC Securities'), city: 'Beijing', region: 'Asia Pacific', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'Beijing', region: 'Asia Pacific', type: 'bank' },
          { name: 'Goldman Sachs', website: getWebsite('Goldman Sachs'), city: 'Beijing', region: 'Asia Pacific', type: 'bank' },
        ]
      },
      {
        city: 'Sydney',
        companies: [
          { name: 'Macquarie', website: getWebsite('Macquarie'), city: 'Sydney', region: 'Asia Pacific', type: 'bank' },
          { name: 'Commonwealth Bank', website: getWebsite('Commonwealth Bank'), city: 'Sydney', region: 'Asia Pacific', type: 'bank' },
          { name: 'Westpac', website: getWebsite('Westpac'), city: 'Sydney', region: 'Asia Pacific', type: 'bank' },
          { name: 'ANZ', website: getWebsite('ANZ'), city: 'Sydney', region: 'Asia Pacific', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'Sydney', region: 'Asia Pacific', type: 'bank' },
          { name: 'Goldman Sachs', website: getWebsite('Goldman Sachs'), city: 'Sydney', region: 'Asia Pacific', type: 'bank' },
          { name: 'UBS', website: getWebsite('UBS'), city: 'Sydney', region: 'Asia Pacific', type: 'bank' },
        ]
      },
    ]
  },
  {
    region: 'Middle East & Africa',
    cities: [
      {
        city: 'Dubai',
        companies: [
          { name: 'Emirates NBD', website: getWebsite('Emirates NBD'), city: 'Dubai', region: 'Middle East & Africa', type: 'bank' },
          { name: 'First Abu Dhabi Bank', website: getWebsite('First Abu Dhabi Bank'), city: 'Dubai', region: 'Middle East & Africa', type: 'bank' },
          { name: 'HSBC', website: getWebsite('HSBC'), city: 'Dubai', region: 'Middle East & Africa', type: 'bank' },
          { name: 'Standard Chartered', website: getWebsite('Standard Chartered'), city: 'Dubai', region: 'Middle East & Africa', type: 'bank' },
          { name: 'Citigroup', website: getWebsite('Citigroup'), city: 'Dubai', region: 'Middle East & Africa', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'Dubai', region: 'Middle East & Africa', type: 'bank' },
          { name: 'Goldman Sachs', website: getWebsite('Goldman Sachs'), city: 'Dubai', region: 'Middle East & Africa', type: 'bank' },
        ]
      },
      {
        city: 'Abu Dhabi',
        companies: [
          { name: 'First Abu Dhabi Bank', website: getWebsite('First Abu Dhabi Bank'), city: 'Abu Dhabi', region: 'Middle East & Africa', type: 'bank' },
          { name: 'HSBC', website: getWebsite('HSBC'), city: 'Abu Dhabi', region: 'Middle East & Africa', type: 'bank' },
          { name: 'Standard Chartered', website: getWebsite('Standard Chartered'), city: 'Abu Dhabi', region: 'Middle East & Africa', type: 'bank' },
        ]
      },
      {
        city: 'Johannesburg',
        companies: [
          { name: 'Standard Bank', website: getWebsite('Standard Bank'), city: 'Johannesburg', region: 'Middle East & Africa', type: 'bank' },
          { name: 'Absa', website: getWebsite('Absa'), city: 'Johannesburg', region: 'Middle East & Africa', type: 'bank' },
          { name: 'Nedbank', website: getWebsite('Nedbank'), city: 'Johannesburg', region: 'Middle East & Africa', type: 'bank' },
          { name: 'Investec', website: getWebsite('Investec'), city: 'Johannesburg', region: 'Middle East & Africa', type: 'bank' },
          { name: 'JPMorgan Chase', website: getWebsite('JPMorgan Chase'), city: 'Johannesburg', region: 'Middle East & Africa', type: 'bank' },
        ]
      },
    ]
  },
]

// Import existing funds data and convert to new structure
import { fundsData as oldFundsData, Fund } from './funds'

// Convert old funds data to new structure
export const fundsData: CompanyLocation[] = oldFundsData.map(region => ({
  ...region,
  cities: region.cities.map(city => ({
    city: city.city,
    companies: city.funds.map((fund: Fund) => ({
      name: fund.name,
      website: fund.website,
      city: fund.city,
      region: fund.region,
      type: 'fund' as CompanyType
    }))
  }))
}))

// Combine banks and funds data
export const companiesData: CompanyLocation[] = [
  ...banksData,
  ...fundsData,
]

// Flatten all companies for search
export const allCompanies: Company[] = companiesData.flatMap(region =>
  region.cities.flatMap(city => city.companies)
)

