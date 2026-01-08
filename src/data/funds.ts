export interface Fund {
  name: string
  website: string
  city: string
  region: string
}

export interface FundLocation {
  region: string
  cities: {
    city: string
    funds: Fund[]
  }[]
}

// Helper function to get website URL for a fund
function getWebsite(fundName: string): string {
  // Map of fund names to their websites
  const fundWebsites: Record<string, string> = {
    '3Red Partners': 'https://www.3redpartners.com',
    'All Options': 'https://www.alloptions.nl',
    'Balyasny Asset Management (BAM)': 'https://www.bamfunds.com',
    'DRW': 'https://www.drw.com',
    'Great Point Capital': 'https://www.greatpointcapital.com',
    'Headlands Technology': 'https://www.headlandstech.com',
    'Hudson River Trading': 'https://www.hudsonrivertrading.com',
    'Jump Trading': 'https://www.jumptrading.com',
    'Kershner Trading Group': 'https://www.keshnertrading.com',
    'PEAK6': 'https://www.peak6.com',
    'Quantlab': 'https://www.quantlab.com',
    'VIRTU Financial': 'https://www.virtu.com',
    'XR Trading': 'https://www.xrtrading.com',
    'DV Trading': 'https://www.dvtrading.com',
    'The Voleon Group': 'https://www.voleon.com',
    'D. E. Shaw': 'https://www.deshaw.com',
    'Squarepoint Capital': 'https://www.squarepoint-capital.com',
    'Akuna Capital': 'https://www.akunacapital.com',
    'AlphaGrep': 'https://www.alphagrep.com',
    'Aquatic': 'https://www.aquaticcapital.com',
    'Belvedere Trading': 'https://www.belvederetrading.com',
    'BlackEdge Capital': 'https://www.blackedgecapital.com',
    'Chicago Trading Company': 'https://www.chicagotrading.com',
    'Consolidated Trading': 'https://www.consolidatedtrading.com',
    'Eagle Seven': 'https://www.eagleseven.com',
    'Eclipse Trading': 'https://www.eclipsetrading.com',
    'Flow Traders': 'https://www.flowtraders.com',
    'Gelber Group': 'https://www.gelbergroup.com',
    'Geneva Trading': 'https://www.genevatrading.com',
    'IMC Trading': 'https://www.imc.com',
    'League Trading': 'https://www.leaguetrading.com',
    'Marquette Partners': 'https://www.marquettepartners.com',
    'Matrix Executions': 'https://www.matrixexecutions.com',
    'Maven Securities': 'https://www.mavensecurities.com',
    'Old Mission Capital': 'https://www.oldmissioncapital.com',
    'Prime Trading': 'https://www.primetrading.com',
    'Radix Trading': 'https://www.radixtrading.com',
    'SCALP Trade': 'https://www.scalptrade.com',
    'SIG': 'https://www.sig.com',
    'Savius': 'https://www.savius.com',
    'Simplex Trading': 'https://www.simplextrading.com',
    'Sumo': 'https://www.sumocapital.com',
    'Tower Research Capital': 'https://www.tower-research.com',
    'TradeLink': 'https://www.tradelink.com',
    'TransMarket Group': 'https://www.transmarketgroup.com',
    'Trillium Trading': 'https://www.trilliumtrading.com',
    'Two Sigma': 'https://www.twosigma.com',
    'Valkyrie Trading': 'https://www.valkyrietrading.com',
    'WH Trading': 'https://www.whtrading.com',
    'Wolverine Trading': 'https://www.wolverinetrading.com',
    'WorldQuant': 'https://www.worldquant.com',
    'AQR Capital Management': 'https://www.aqr.com',
    'Da Vinci Trading': 'https://www.davincitrading.com',
    'Black Eagle Financial Group': 'https://www.blackeaglefinancial.com',
    'ACT Group': 'https://www.actgroup.com',
    'Allston Trading': 'https://www.allstontrading.com',
    'Ansatz Capital': 'https://www.ansatzcapital.com',
    'Arrowstreet Capital': 'https://www.arrowstreetcapital.com',
    'Chimera Securities': 'https://www.chimerasecurities.com',
    'Clear Street': 'https://www.clearstreet.io',
    'Cubist (Point72)': 'https://www.point72.com',
    'Epoch Capital': 'https://www.epochcapital.com',
    'Five Rings': 'https://www.fiverings.com',
    'HAP Capital': 'https://www.hapcapital.com',
    'Jane Street': 'https://www.janestreet.com',
    'Keyrock': 'https://www.keyrock.eu',
    'Kronos Research': 'https://www.kronosresearch.com',
    'Marshall Wace': 'https://www.marshallwace.com',
    'Millenium': 'https://www.mlp.com',
    'OTC Flow': 'https://www.otcflow.com',
    'Quadeye': 'https://www.quadeye.com',
    'Seven Eight Capital': 'https://www.seveneightcapital.com',
    'Seven Points Capital': 'https://www.sevenpointscapital.com',
    'T3 Trading Group': 'https://www.t3trading.com',
    'Vatic Labs': 'https://www.vaticlabs.com',
    'XTX Markets': 'https://www.xtxmarkets.com',
    'Trexquant': 'https://www.trexquant.com',
    '323 Trading': 'https://www.323trading.com',
    'Accent Group': 'https://www.accentgroup.com',
    'Algorithmic Trading Group': 'https://www.algorithmictrading.com',
    'Barak Capital': 'https://www.barakcapital.com',
    'BlockTech': 'https://www.blocktech.com',
    'Criterion Arbitrage & Trading': 'https://www.criteriontrading.com',
    'Cross Options': 'https://www.crossoptions.com',
    'D2X': 'https://www.d2x.com',
    'Deep Blue Capital': 'https://www.deepbluecapital.com',
    'Mako Trading': 'https://www.makotrading.com',
    'Market Wizards': 'https://www.marketwizards.com',
    'Mathrix': 'https://www.mathrix.com',
    'Maverick Derivatives': 'https://www.maverickderivatives.com',
    'Nino Options': 'https://www.ninooptions.com',
    'Northpool': 'https://www.northpool.com',
    'Nyenburgh': 'https://www.nyenburgh.com',
    'ORA Traders': 'https://www.oratraders.com',
    'Priogen Energy': 'https://www.priogenenergy.com',
    'VivCourt Trading': 'https://www.vivcourttrading.com',
    'WEBB Traders': 'https://www.webbtraders.com',
    'UTR8 Group': 'https://www.utr8group.com',
    'Wincent': 'https://www.wincent.com',
    'Quantbox Research': 'https://www.quantboxresearch.com',
    'Z.R.T.X.': 'https://www.zrtx.com',
    'Amplify Trading': 'https://www.amplifytrading.com',
    'B2C2': 'https://www.b2c2.com',
    'G-Research': 'https://www.gresearch.com',
    'GSR': 'https://www.gsr.io',
    'Jerpoint Capital': 'https://www.jerpointcapital.com',
    'OSTC Ltd.': 'https://www.ostc.com',
    'Tibra': 'https://www.tibra.com',
    'Wintermute': 'https://www.wintermute.com',
    'XY Capital': 'https://www.xycapital.com',
    'KeyQuant': 'https://www.keyquant.com',
    'Woorton': 'https://www.woorton.com',
    'Gravity Team': 'https://www.gravityteam.com',
    'Domstad Traders': 'https://www.domstadtraders.com',
    'Amber Group': 'https://www.ambergroup.com',
    'Liquid Capital Group': 'https://www.liquidcapitalgroup.com',
    'Bondi Tech': 'https://www.bonditech.com',
    'Nine Mile': 'https://www.ninemile.com',
    'Genk Capital': 'https://www.genkcapital.com',
    'Grasshopper': 'https://www.grasshopper.com',
    'Graviton Research Capital': 'https://www.gravitonresearch.com',
    'NK Securities': 'https://www.nksecurities.com',
    '26 Miles Capital': 'https://www.26milescapital.com',
    'Statar Capital': 'https://www.statarcapital.com/',
  }

  // Return the website if found, otherwise use a generic search URL
  return fundWebsites[fundName] || `https://www.google.com/search?q=${encodeURIComponent(fundName)}`
}

// Funds data organized by region and city
export const fundsData: FundLocation[] = [
  {
    region: 'North America',
    cities: [
      {
        city: 'Austin',
        funds: [
          { name: '3Red Partners', website: getWebsite('3Red Partners'), city: 'Austin', region: 'North America' },
          { name: 'All Options', website: getWebsite('All Options'), city: 'Austin', region: 'North America' },
          { name: 'Balyasny Asset Management (BAM)', website: getWebsite('Balyasny Asset Management (BAM)'), city: 'Austin', region: 'North America' },
          { name: 'DRW', website: getWebsite('DRW'), city: 'Austin', region: 'North America' },
          { name: 'Great Point Capital', website: getWebsite('Great Point Capital'), city: 'Austin', region: 'North America' },
          { name: 'Headlands Technology', website: getWebsite('Headlands Technology'), city: 'Austin', region: 'North America' },
          { name: 'Hudson River Trading', website: getWebsite('Hudson River Trading'), city: 'Austin', region: 'North America' },
          { name: 'Jump Trading', website: getWebsite('Jump Trading'), city: 'Austin', region: 'North America' },
          { name: 'Kershner Trading Group', website: getWebsite('Kershner Trading Group'), city: 'Austin', region: 'North America' },
          { name: 'PEAK6', website: getWebsite('PEAK6'), city: 'Austin', region: 'North America' },
          { name: 'Quantlab', website: getWebsite('Quantlab'), city: 'Austin', region: 'North America' },
          { name: 'VIRTU Financial', website: getWebsite('VIRTU Financial'), city: 'Austin', region: 'North America' },
          { name: 'XR Trading', website: getWebsite('XR Trading'), city: 'Austin', region: 'North America' },
        ]
      },
      {
        city: 'Bahamas',
        funds: [
          { name: 'DV Trading', website: getWebsite('DV Trading'), city: 'Bahamas', region: 'North America' },
        ]
      },
      {
        city: 'Berkeley',
        funds: [
          { name: 'The Voleon Group', website: getWebsite('The Voleon Group'), city: 'Berkeley', region: 'North America' },
        ]
      },
      {
        city: 'Boston',
        funds: [
          { name: 'D. E. Shaw', website: getWebsite('D. E. Shaw'), city: 'Boston', region: 'North America' },
          { name: 'Quantlab', website: getWebsite('Quantlab'), city: 'Boston', region: 'North America' },
          { name: 'Squarepoint Capital', website: getWebsite('Squarepoint Capital'), city: 'Boston', region: 'North America' },
          { name: 'VIRTU Financial', website: getWebsite('VIRTU Financial'), city: 'Boston', region: 'North America' },
        ]
      },
      {
        city: 'Chicago',
        funds: [
          { name: '3Red Partners', website: getWebsite('3Red Partners'), city: 'Chicago', region: 'North America' },
          { name: 'Akuna Capital', website: getWebsite('Akuna Capital'), city: 'Chicago', region: 'North America' },
          { name: 'AlphaGrep', website: getWebsite('AlphaGrep'), city: 'Chicago', region: 'North America' },
          { name: 'Aquatic', website: getWebsite('Aquatic'), city: 'Chicago', region: 'North America' },
          { name: 'Balyasny Asset Management (BAM)', website: getWebsite('Balyasny Asset Management (BAM)'), city: 'Chicago', region: 'North America' },
          { name: 'Belvedere Trading', website: getWebsite('Belvedere Trading'), city: 'Chicago', region: 'North America' },
          { name: 'BlackEdge Capital', website: getWebsite('BlackEdge Capital'), city: 'Chicago', region: 'North America' },
          { name: 'Chicago Trading Company', website: getWebsite('Chicago Trading Company'), city: 'Chicago', region: 'North America' },
          { name: 'Consolidated Trading', website: getWebsite('Consolidated Trading'), city: 'Chicago', region: 'North America' },
          { name: 'DRW', website: getWebsite('DRW'), city: 'Chicago', region: 'North America' },
          { name: 'DV Trading', website: getWebsite('DV Trading'), city: 'Chicago', region: 'North America' },
          { name: 'Eagle Seven', website: getWebsite('Eagle Seven'), city: 'Chicago', region: 'North America' },
          { name: 'Eclipse Trading', website: getWebsite('Eclipse Trading'), city: 'Chicago', region: 'North America' },
          { name: 'Flow Traders', website: getWebsite('Flow Traders'), city: 'Chicago', region: 'North America' },
          { name: 'Gelber Group', website: getWebsite('Gelber Group'), city: 'Chicago', region: 'North America' },
          { name: 'Geneva Trading', website: getWebsite('Geneva Trading'), city: 'Chicago', region: 'North America' },
          { name: 'Great Point Capital', website: getWebsite('Great Point Capital'), city: 'Chicago', region: 'North America' },
          { name: 'Headlands Technology', website: getWebsite('Headlands Technology'), city: 'Chicago', region: 'North America' },
          { name: 'Hudson River Trading', website: getWebsite('Hudson River Trading'), city: 'Chicago', region: 'North America' },
          { name: 'IMC Trading', website: getWebsite('IMC Trading'), city: 'Chicago', region: 'North America' },
          { name: 'Jump Trading', website: getWebsite('Jump Trading'), city: 'Chicago', region: 'North America' },
          { name: 'League Trading', website: getWebsite('League Trading'), city: 'Chicago', region: 'North America' },
          { name: 'Marquette Partners', website: getWebsite('Marquette Partners'), city: 'Chicago', region: 'North America' },
          { name: 'Matrix Executions', website: getWebsite('Matrix Executions'), city: 'Chicago', region: 'North America' },
          { name: 'Maven Securities', website: getWebsite('Maven Securities'), city: 'Chicago', region: 'North America' },
          { name: 'Old Mission Capital', website: getWebsite('Old Mission Capital'), city: 'Chicago', region: 'North America' },
          { name: 'PEAK6', website: getWebsite('PEAK6'), city: 'Chicago', region: 'North America' },
          { name: 'Prime Trading', website: getWebsite('Prime Trading'), city: 'Chicago', region: 'North America' },
          { name: 'Radix Trading', website: getWebsite('Radix Trading'), city: 'Chicago', region: 'North America' },
          { name: 'SCALP Trade', website: getWebsite('SCALP Trade'), city: 'Chicago', region: 'North America' },
          { name: 'SIG', website: getWebsite('SIG'), city: 'Chicago', region: 'North America' },
          { name: 'Savius', website: getWebsite('Savius'), city: 'Chicago', region: 'North America' },
          { name: 'Simplex Trading', website: getWebsite('Simplex Trading'), city: 'Chicago', region: 'North America' },
          { name: 'Sumo', website: getWebsite('Sumo'), city: 'Chicago', region: 'North America' },
          { name: 'Tower Research Capital', website: getWebsite('Tower Research Capital'), city: 'Chicago', region: 'North America' },
          { name: 'TradeLink', website: getWebsite('TradeLink'), city: 'Chicago', region: 'North America' },
          { name: 'TransMarket Group', website: getWebsite('TransMarket Group'), city: 'Chicago', region: 'North America' },
          { name: 'Trillium Trading', website: getWebsite('Trillium Trading'), city: 'Chicago', region: 'North America' },
          { name: 'Two Sigma', website: getWebsite('Two Sigma'), city: 'Chicago', region: 'North America' },
          { name: 'VIRTU Financial', website: getWebsite('VIRTU Financial'), city: 'Chicago', region: 'North America' },
          { name: 'Valkyrie Trading', website: getWebsite('Valkyrie Trading'), city: 'Chicago', region: 'North America' },
          { name: 'WH Trading', website: getWebsite('WH Trading'), city: 'Chicago', region: 'North America' },
          { name: 'Wolverine Trading', website: getWebsite('Wolverine Trading'), city: 'Chicago', region: 'North America' },
          { name: 'WorldQuant', website: getWebsite('WorldQuant'), city: 'Chicago', region: 'North America' },
          { name: 'XR Trading', website: getWebsite('XR Trading'), city: 'Chicago', region: 'North America' },
        ]
      },
      {
        city: 'Denver',
        funds: [
          { name: 'Quantlab', website: getWebsite('Quantlab'), city: 'Denver', region: 'North America' },
        ]
      },
      {
        city: 'Greenwich',
        funds: [
          { name: 'AQR Capital Management', website: getWebsite('AQR Capital Management'), city: 'Greenwich', region: 'North America' },
          { name: 'Balyasny Asset Management (BAM)', website: getWebsite('Balyasny Asset Management (BAM)'), city: 'Greenwich', region: 'North America' },
        ]
      },
      {
        city: 'Houston',
        funds: [
          { name: 'DV Trading', website: getWebsite('DV Trading'), city: 'Houston', region: 'North America' },
          { name: 'Quantlab', website: getWebsite('Quantlab'), city: 'Houston', region: 'North America' },
          { name: 'Squarepoint Capital', website: getWebsite('Squarepoint Capital'), city: 'Houston', region: 'North America' },
          { name: 'Two Sigma', website: getWebsite('Two Sigma'), city: 'Houston', region: 'North America' },
        ]
      },
      {
        city: 'Miami',
        funds: [
          { name: '3Red Partners', website: getWebsite('3Red Partners'), city: 'Miami', region: 'North America' },
          { name: 'Balyasny Asset Management (BAM)', website: getWebsite('Balyasny Asset Management (BAM)'), city: 'Miami', region: 'North America' },
          { name: 'DV Trading', website: getWebsite('DV Trading'), city: 'Miami', region: 'North America' },
          { name: 'Da Vinci Trading', website: getWebsite('Da Vinci Trading'), city: 'Miami', region: 'North America' },
          { name: 'Hudson River Trading', website: getWebsite('Hudson River Trading'), city: 'Miami', region: 'North America' },
          { name: 'SIG', website: getWebsite('SIG'), city: 'Miami', region: 'North America' },
          { name: 'TradeLink', website: getWebsite('TradeLink'), city: 'Miami', region: 'North America' },
          { name: 'Trillium Trading', website: getWebsite('Trillium Trading'), city: 'Miami', region: 'North America' },
          { name: 'VIRTU Financial', website: getWebsite('VIRTU Financial'), city: 'Miami', region: 'North America' },
        ]
      },
      {
        city: 'Montreal',
        funds: [
          { name: 'Black Eagle Financial Group', website: getWebsite('Black Eagle Financial Group'), city: 'Montreal', region: 'North America' },
        ]
      },
      {
        city: 'New York',
        funds: [
          { name: '3Red Partners', website: getWebsite('3Red Partners'), city: 'New York', region: 'North America' },
          { name: 'ACT Group', website: getWebsite('ACT Group'), city: 'New York', region: 'North America' },
          { name: 'Allston Trading', website: getWebsite('Allston Trading'), city: 'New York', region: 'North America' },
          { name: 'Ansatz Capital', website: getWebsite('Ansatz Capital'), city: 'New York', region: 'North America' },
          { name: 'Aquatic', website: getWebsite('Aquatic'), city: 'New York', region: 'North America' },
          { name: 'Arrowstreet Capital', website: getWebsite('Arrowstreet Capital'), city: 'New York', region: 'North America' },
          { name: 'Balyasny Asset Management (BAM)', website: getWebsite('Balyasny Asset Management (BAM)'), city: 'New York', region: 'North America' },
          { name: 'Belvedere Trading', website: getWebsite('Belvedere Trading'), city: 'New York', region: 'North America' },
          { name: 'Chicago Trading Company', website: getWebsite('Chicago Trading Company'), city: 'New York', region: 'North America' },
          { name: 'Chimera Securities', website: getWebsite('Chimera Securities'), city: 'New York', region: 'North America' },
          { name: 'Clear Street', website: getWebsite('Clear Street'), city: 'New York', region: 'North America' },
          { name: 'Cubist (Point72)', website: getWebsite('Cubist (Point72)'), city: 'New York', region: 'North America' },
          { name: 'D. E. Shaw', website: getWebsite('D. E. Shaw'), city: 'New York', region: 'North America' },
          { name: 'DRW', website: getWebsite('DRW'), city: 'New York', region: 'North America' },
          { name: 'DV Trading', website: getWebsite('DV Trading'), city: 'New York', region: 'North America' },
          { name: 'Epoch Capital', website: getWebsite('Epoch Capital'), city: 'New York', region: 'North America' },
          { name: 'Five Rings', website: getWebsite('Five Rings'), city: 'New York', region: 'North America' },
          { name: 'Flow Traders', website: getWebsite('Flow Traders'), city: 'New York', region: 'North America' },
          { name: 'HAP Capital', website: getWebsite('HAP Capital'), city: 'New York', region: 'North America' },
          { name: 'Headlands Technology', website: getWebsite('Headlands Technology'), city: 'New York', region: 'North America' },
          { name: 'Hudson River Trading', website: getWebsite('Hudson River Trading'), city: 'New York', region: 'North America' },
          { name: 'IMC Trading', website: getWebsite('IMC Trading'), city: 'New York', region: 'North America' },
          { name: 'Jane Street', website: getWebsite('Jane Street'), city: 'New York', region: 'North America' },
          { name: 'Jump Trading', website: getWebsite('Jump Trading'), city: 'New York', region: 'North America' },
          { name: 'Kershner Trading Group', website: getWebsite('Kershner Trading Group'), city: 'New York', region: 'North America' },
          { name: 'Keyrock', website: getWebsite('Keyrock'), city: 'New York', region: 'North America' },
          { name: 'Kronos Research', website: getWebsite('Kronos Research'), city: 'New York', region: 'North America' },
          { name: 'Marshall Wace', website: getWebsite('Marshall Wace'), city: 'New York', region: 'North America' },
          { name: 'Maven Securities', website: getWebsite('Maven Securities'), city: 'New York', region: 'North America' },
          { name: 'Millenium', website: getWebsite('Millenium'), city: 'New York', region: 'North America' },
          { name: 'OTC Flow', website: getWebsite('OTC Flow'), city: 'New York', region: 'North America' },
          { name: 'Old Mission Capital', website: getWebsite('Old Mission Capital'), city: 'New York', region: 'North America' },
          { name: 'Quadeye', website: getWebsite('Quadeye'), city: 'New York', region: 'North America' },
          { name: 'Quantlab', website: getWebsite('Quantlab'), city: 'New York', region: 'North America' },
          { name: 'Radix Trading', website: getWebsite('Radix Trading'), city: 'New York', region: 'North America' },
          { name: 'SIG', website: getWebsite('SIG'), city: 'New York', region: 'North America' },
          { name: 'Seven Eight Capital', website: getWebsite('Seven Eight Capital'), city: 'New York', region: 'North America' },
          { name: 'Seven Points Capital', website: getWebsite('Seven Points Capital'), city: 'New York', region: 'North America' },
          { name: 'Squarepoint Capital', website: getWebsite('Squarepoint Capital'), city: 'New York', region: 'North America' },
          { name: 'Sumo', website: getWebsite('Sumo'), city: 'New York', region: 'North America' },
          { name: 'T3 Trading Group', website: getWebsite('T3 Trading Group'), city: 'New York', region: 'North America' },
          { name: 'Tower Research Capital', website: getWebsite('Tower Research Capital'), city: 'New York', region: 'North America' },
          { name: 'Trillium Trading', website: getWebsite('Trillium Trading'), city: 'New York', region: 'North America' },
          { name: 'Two Sigma', website: getWebsite('Two Sigma'), city: 'New York', region: 'North America' },
          { name: 'VIRTU Financial', website: getWebsite('VIRTU Financial'), city: 'New York', region: 'North America' },
          { name: 'Vatic Labs', website: getWebsite('Vatic Labs'), city: 'New York', region: 'North America' },
          { name: 'Wolverine Trading', website: getWebsite('Wolverine Trading'), city: 'New York', region: 'North America' },
          { name: 'XR Trading', website: getWebsite('XR Trading'), city: 'New York', region: 'North America' },
          { name: 'XTX Markets', website: getWebsite('XTX Markets'), city: 'New York', region: 'North America' },
          { name: 'Statar Capital', website: getWebsite('Statar Capital'), city: 'New York', region: 'North America' },
        ]
      },
      {
        city: 'Philadelphia',
        funds: [
          { name: 'SIG', website: getWebsite('SIG'), city: 'Philadelphia', region: 'North America' },
        ]
      },
      {
        city: 'San Francisco',
        funds: [
          { name: 'Balyasny Asset Management (BAM)', website: getWebsite('Balyasny Asset Management (BAM)'), city: 'San Francisco', region: 'North America' },
          { name: 'D. E. Shaw', website: getWebsite('D. E. Shaw'), city: 'San Francisco', region: 'North America' },
        ]
      },
      {
        city: 'Stamford',
        funds: [
          { name: 'Cubist (Point72)', website: getWebsite('Cubist (Point72)'), city: 'Stamford', region: 'North America' },
          { name: 'Trexquant', website: getWebsite('Trexquant'), city: 'Stamford', region: 'North America' },
        ]
      },
      {
        city: 'Toronto',
        funds: [
          { name: 'Balyasny Asset Management (BAM)', website: getWebsite('Balyasny Asset Management (BAM)'), city: 'Toronto', region: 'North America' },
          { name: 'DV Trading', website: getWebsite('DV Trading'), city: 'Toronto', region: 'North America' },
          { name: 'Seven Points Capital', website: getWebsite('Seven Points Capital'), city: 'Toronto', region: 'North America' },
        ]
      },
      {
        city: 'Vancouver',
        funds: [
          { name: 'Sumo', website: getWebsite('Sumo'), city: 'Vancouver', region: 'North America' },
        ]
      },
      {
        city: 'White Plains',
        funds: [
          { name: 'Gelber Group', website: getWebsite('Gelber Group'), city: 'White Plains', region: 'North America' },
        ]
      },
    ]
  },
  {
    region: 'Europe',
    cities: [
      {
        city: 'Amsterdam',
        funds: [
          { name: '323 Trading', website: getWebsite('323 Trading'), city: 'Amsterdam', region: 'Europe' },
          { name: '3Red Partners', website: getWebsite('3Red Partners'), city: 'Amsterdam', region: 'Europe' },
          { name: 'ACT Group', website: getWebsite('ACT Group'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Accent Group', website: getWebsite('Accent Group'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Algorithmic Trading Group', website: getWebsite('Algorithmic Trading Group'), city: 'Amsterdam', region: 'Europe' },
          { name: 'All Options', website: getWebsite('All Options'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Barak Capital', website: getWebsite('Barak Capital'), city: 'Amsterdam', region: 'Europe' },
          { name: 'BlockTech', website: getWebsite('BlockTech'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Chicago Trading Company', website: getWebsite('Chicago Trading Company'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Criterion Arbitrage & Trading', website: getWebsite('Criterion Arbitrage & Trading'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Cross Options', website: getWebsite('Cross Options'), city: 'Amsterdam', region: 'Europe' },
          { name: 'D2X', website: getWebsite('D2X'), city: 'Amsterdam', region: 'Europe' },
          { name: 'DRW', website: getWebsite('DRW'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Da Vinci Trading', website: getWebsite('Da Vinci Trading'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Deep Blue Capital', website: getWebsite('Deep Blue Capital'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Eagle Seven', website: getWebsite('Eagle Seven'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Five Rings', website: getWebsite('Five Rings'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Flow Traders', website: getWebsite('Flow Traders'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Gelber Group', website: getWebsite('Gelber Group'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Headlands Technology', website: getWebsite('Headlands Technology'), city: 'Amsterdam', region: 'Europe' },
          { name: 'IMC Trading', website: getWebsite('IMC Trading'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Jane Street', website: getWebsite('Jane Street'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Jump Trading', website: getWebsite('Jump Trading'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Mako Trading', website: getWebsite('Mako Trading'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Market Wizards', website: getWebsite('Market Wizards'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Mathrix', website: getWebsite('Mathrix'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Maven Securities', website: getWebsite('Maven Securities'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Maverick Derivatives', website: getWebsite('Maverick Derivatives'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Nino Options', website: getWebsite('Nino Options'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Northpool', website: getWebsite('Northpool'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Nyenburgh', website: getWebsite('Nyenburgh'), city: 'Amsterdam', region: 'Europe' },
          { name: 'ORA Traders', website: getWebsite('ORA Traders'), city: 'Amsterdam', region: 'Europe' },
          { name: 'OTC Flow', website: getWebsite('OTC Flow'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Priogen Energy', website: getWebsite('Priogen Energy'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Radix Trading', website: getWebsite('Radix Trading'), city: 'Amsterdam', region: 'Europe' },
          { name: 'Tower Research Capital', website: getWebsite('Tower Research Capital'), city: 'Amsterdam', region: 'Europe' },
          { name: 'VivCourt Trading', website: getWebsite('VivCourt Trading'), city: 'Amsterdam', region: 'Europe' },
          { name: 'WEBB Traders', website: getWebsite('WEBB Traders'), city: 'Amsterdam', region: 'Europe' },
        ]
      },
      {
        city: 'Baar',
        funds: [
          { name: 'UTR8 Group', website: getWebsite('UTR8 Group'), city: 'Baar', region: 'Europe' },
        ]
      },
      {
        city: 'Bratislava',
        funds: [
          { name: 'Wincent', website: getWebsite('Wincent'), city: 'Bratislava', region: 'Europe' },
        ]
      },
      {
        city: 'Cambridge',
        funds: [
          { name: 'Quantbox Research', website: getWebsite('Quantbox Research'), city: 'Cambridge', region: 'Europe' },
        ]
      },
      {
        city: 'Cluj-Napoca',
        funds: [
          { name: 'Flow Traders', website: getWebsite('Flow Traders'), city: 'Cluj-Napoca', region: 'Europe' },
        ]
      },
      {
        city: 'Dublin',
        funds: [
          { name: 'Mako Trading', website: getWebsite('Mako Trading'), city: 'Dublin', region: 'Europe' },
        ]
      },
      {
        city: 'Gibraltar',
        funds: [
          { name: 'Wincent', website: getWebsite('Wincent'), city: 'Gibraltar', region: 'Europe' },
        ]
      },
      {
        city: 'Larnaca',
        funds: [
          { name: 'Z.R.T.X.', website: getWebsite('Z.R.T.X.'), city: 'Larnaca', region: 'Europe' },
        ]
      },
      {
        city: 'London',
        funds: [
          { name: '3Red Partners', website: getWebsite('3Red Partners'), city: 'London', region: 'Europe' },
          { name: 'AQR Capital Management', website: getWebsite('AQR Capital Management'), city: 'London', region: 'Europe' },
          { name: 'Akuna Capital', website: getWebsite('Akuna Capital'), city: 'London', region: 'Europe' },
          { name: 'Allston Trading', website: getWebsite('Allston Trading'), city: 'London', region: 'Europe' },
          { name: 'AlphaGrep', website: getWebsite('AlphaGrep'), city: 'London', region: 'Europe' },
          { name: 'Amplify Trading', website: getWebsite('Amplify Trading'), city: 'London', region: 'Europe' },
          { name: 'Aquatic', website: getWebsite('Aquatic'), city: 'London', region: 'Europe' },
          { name: 'B2C2', website: getWebsite('B2C2'), city: 'London', region: 'Europe' },
          { name: 'Balyasny Asset Management (BAM)', website: getWebsite('Balyasny Asset Management (BAM)'), city: 'London', region: 'Europe' },
          { name: 'Chicago Trading Company', website: getWebsite('Chicago Trading Company'), city: 'London', region: 'Europe' },
          { name: 'Cubist (Point72)', website: getWebsite('Cubist (Point72)'), city: 'London', region: 'Europe' },
          { name: 'D. E. Shaw', website: getWebsite('D. E. Shaw'), city: 'London', region: 'Europe' },
          { name: 'DRW', website: getWebsite('DRW'), city: 'London', region: 'Europe' },
          { name: 'DV Trading', website: getWebsite('DV Trading'), city: 'London', region: 'Europe' },
          { name: 'Epoch Capital', website: getWebsite('Epoch Capital'), city: 'London', region: 'Europe' },
          { name: 'Five Rings', website: getWebsite('Five Rings'), city: 'London', region: 'Europe' },
          { name: 'Flow Traders', website: getWebsite('Flow Traders'), city: 'London', region: 'Europe' },
          { name: 'G-Research', website: getWebsite('G-Research'), city: 'London', region: 'Europe' },
          { name: 'GSR', website: getWebsite('GSR'), city: 'London', region: 'Europe' },
          { name: 'Geneva Trading', website: getWebsite('Geneva Trading'), city: 'London', region: 'Europe' },
          { name: 'Hudson River Trading', website: getWebsite('Hudson River Trading'), city: 'London', region: 'Europe' },
          { name: 'IMC Trading', website: getWebsite('IMC Trading'), city: 'London', region: 'Europe' },
          { name: 'Jane Street', website: getWebsite('Jane Street'), city: 'London', region: 'Europe' },
          { name: 'Jerpoint Capital', website: getWebsite('Jerpoint Capital'), city: 'London', region: 'Europe' },
          { name: 'Jump Trading', website: getWebsite('Jump Trading'), city: 'London', region: 'Europe' },
          { name: 'Keyrock', website: getWebsite('Keyrock'), city: 'London', region: 'Europe' },
          { name: 'Kronos Research', website: getWebsite('Kronos Research'), city: 'London', region: 'Europe' },
          { name: 'Mako Trading', website: getWebsite('Mako Trading'), city: 'London', region: 'Europe' },
          { name: 'Marshall Wace', website: getWebsite('Marshall Wace'), city: 'London', region: 'Europe' },
          { name: 'Maven Securities', website: getWebsite('Maven Securities'), city: 'London', region: 'Europe' },
          { name: 'Millenium', website: getWebsite('Millenium'), city: 'London', region: 'Europe' },
          { name: 'OSTC Ltd.', website: getWebsite('OSTC Ltd.'), city: 'London', region: 'Europe' },
          { name: 'Old Mission Capital', website: getWebsite('Old Mission Capital'), city: 'London', region: 'Europe' },
          { name: 'SIG', website: getWebsite('SIG'), city: 'London', region: 'Europe' },
          { name: 'Squarepoint Capital', website: getWebsite('Squarepoint Capital'), city: 'London', region: 'Europe' },
          { name: 'Tibra', website: getWebsite('Tibra'), city: 'London', region: 'Europe' },
          { name: 'Tower Research Capital', website: getWebsite('Tower Research Capital'), city: 'London', region: 'Europe' },
          { name: 'TradeLink', website: getWebsite('TradeLink'), city: 'London', region: 'Europe' },
          { name: 'Two Sigma', website: getWebsite('Two Sigma'), city: 'London', region: 'Europe' },
          { name: 'VIRTU Financial', website: getWebsite('VIRTU Financial'), city: 'London', region: 'Europe' },
          { name: 'WEBB Traders', website: getWebsite('WEBB Traders'), city: 'London', region: 'Europe' },
          { name: 'Wintermute', website: getWebsite('Wintermute'), city: 'London', region: 'Europe' },
          { name: 'Wolverine Trading', website: getWebsite('Wolverine Trading'), city: 'London', region: 'Europe' },
          { name: 'XR Trading', website: getWebsite('XR Trading'), city: 'London', region: 'Europe' },
          { name: 'XTX Markets', website: getWebsite('XTX Markets'), city: 'London', region: 'Europe' },
          { name: 'XY Capital', website: getWebsite('XY Capital'), city: 'London', region: 'Europe' },
        ]
      },
      {
        city: 'Milan',
        funds: [
          { name: 'Flow Traders', website: getWebsite('Flow Traders'), city: 'Milan', region: 'Europe' },
        ]
      },
      {
        city: 'Monaco',
        funds: [
          { name: 'Maven Securities', website: getWebsite('Maven Securities'), city: 'Monaco', region: 'Europe' },
        ]
      },
      {
        city: 'Munich',
        funds: [
          { name: 'AQR Capital Management', website: getWebsite('AQR Capital Management'), city: 'Munich', region: 'Europe' },
        ]
      },
      {
        city: 'Paris',
        funds: [
          { name: 'Flow Traders', website: getWebsite('Flow Traders'), city: 'Paris', region: 'Europe' },
          { name: 'KeyQuant', website: getWebsite('KeyQuant'), city: 'Paris', region: 'Europe' },
          { name: 'Keyrock', website: getWebsite('Keyrock'), city: 'Paris', region: 'Europe' },
          { name: 'OTC Flow', website: getWebsite('OTC Flow'), city: 'Paris', region: 'Europe' },
          { name: 'Squarepoint Capital', website: getWebsite('Squarepoint Capital'), city: 'Paris', region: 'Europe' },
          { name: 'WEBB Traders', website: getWebsite('WEBB Traders'), city: 'Paris', region: 'Europe' },
          { name: 'Woorton', website: getWebsite('Woorton'), city: 'Paris', region: 'Europe' },
        ]
      },
      {
        city: 'Riga',
        funds: [
          { name: 'Gravity Team', website: getWebsite('Gravity Team'), city: 'Riga', region: 'Europe' },
        ]
      },
      {
        city: 'Utrecht',
        funds: [
          { name: 'Domstad Traders', website: getWebsite('Domstad Traders'), city: 'Utrecht', region: 'Europe' },
          { name: 'UTR8 Group', website: getWebsite('UTR8 Group'), city: 'Utrecht', region: 'Europe' },
        ]
      },
      {
        city: 'Zurich',
        funds: [
          { name: 'Wincent', website: getWebsite('Wincent'), city: 'Zurich', region: 'Europe' },
        ]
      },
    ]
  },
  {
    region: 'Asia–Pacific',
    cities: [
      {
        city: 'Bangalore',
        funds: [
          { name: 'Cubist (Point72)', website: getWebsite('Cubist (Point72)'), city: 'Bangalore', region: 'Asia–Pacific' },
          { name: 'D. E. Shaw', website: getWebsite('D. E. Shaw'), city: 'Bangalore', region: 'Asia–Pacific' },
          { name: 'Quantbox Research', website: getWebsite('Quantbox Research'), city: 'Bangalore', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Beijing',
        funds: [
          { name: 'Trexquant', website: getWebsite('Trexquant'), city: 'Beijing', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Brisbane',
        funds: [
          { name: 'Mako Trading', website: getWebsite('Mako Trading'), city: 'Brisbane', region: 'Asia–Pacific' },
          { name: 'VivCourt Trading', website: getWebsite('VivCourt Trading'), city: 'Brisbane', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Chengdu',
        funds: [
          { name: 'Mako Trading', website: getWebsite('Mako Trading'), city: 'Chengdu', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Dubai',
        funds: [
          { name: 'AQR Capital Management', website: getWebsite('AQR Capital Management'), city: 'Dubai', region: 'Asia–Pacific' },
          { name: 'DV Trading', website: getWebsite('DV Trading'), city: 'Dubai', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Gandhinagar',
        funds: [
          { name: 'NK Securities', website: getWebsite('NK Securities'), city: 'Gandhinagar', region: 'Asia–Pacific' },
          { name: 'Quadeye', website: getWebsite('Quadeye'), city: 'Gandhinagar', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Gurgaon',
        funds: [
          { name: '26 Miles Capital', website: getWebsite('26 Miles Capital'), city: 'Gurgaon', region: 'Asia–Pacific' },
          { name: 'Quantbox Research', website: getWebsite('Quantbox Research'), city: 'Gurgaon', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Gurugram',
        funds: [
          { name: 'D. E. Shaw', website: getWebsite('D. E. Shaw'), city: 'Gurugram', region: 'Asia–Pacific' },
          { name: 'Graviton Research Capital', website: getWebsite('Graviton Research Capital'), city: 'Gurugram', region: 'Asia–Pacific' },
          { name: 'NK Securities', website: getWebsite('NK Securities'), city: 'Gurugram', region: 'Asia–Pacific' },
          { name: 'Quadeye', website: getWebsite('Quadeye'), city: 'Gurugram', region: 'Asia–Pacific' },
          { name: 'Trexquant', website: getWebsite('Trexquant'), city: 'Gurugram', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Hong Kong',
        funds: [
          { name: 'AQR Capital Management', website: getWebsite('AQR Capital Management'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Akuna Capital', website: getWebsite('Akuna Capital'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Algorithmic Trading Group', website: getWebsite('Algorithmic Trading Group'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Amber Group', website: getWebsite('Amber Group'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Balyasny Asset Management (BAM)', website: getWebsite('Balyasny Asset Management (BAM)'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Cubist (Point72)', website: getWebsite('Cubist (Point72)'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Eclipse Trading', website: getWebsite('Eclipse Trading'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Flow Traders', website: getWebsite('Flow Traders'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'HAP Capital', website: getWebsite('HAP Capital'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Hudson River Trading', website: getWebsite('Hudson River Trading'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'IMC Trading', website: getWebsite('IMC Trading'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Jane Street', website: getWebsite('Jane Street'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Jump Trading', website: getWebsite('Jump Trading'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Kronos Research', website: getWebsite('Kronos Research'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Liquid Capital Group', website: getWebsite('Liquid Capital Group'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Maven Securities', website: getWebsite('Maven Securities'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Quadeye', website: getWebsite('Quadeye'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'SIG', website: getWebsite('SIG'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Tibra', website: getWebsite('Tibra'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'Tower Research Capital', website: getWebsite('Tower Research Capital'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'UTR8 Group', website: getWebsite('UTR8 Group'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'VIRTU Financial', website: getWebsite('VIRTU Financial'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'VivCourt Trading', website: getWebsite('VivCourt Trading'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'WEBB Traders', website: getWebsite('WEBB Traders'), city: 'Hong Kong', region: 'Asia–Pacific' },
          { name: 'XY Capital', website: getWebsite('XY Capital'), city: 'Hong Kong', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Hyderabad',
        funds: [
          { name: 'D. E. Shaw', website: getWebsite('D. E. Shaw'), city: 'Hyderabad', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Kolkata',
        funds: [
          { name: 'Quadeye', website: getWebsite('Quadeye'), city: 'Kolkata', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Melbourne',
        funds: [
          { name: 'VivCourt Trading', website: getWebsite('VivCourt Trading'), city: 'Melbourne', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Mumbai',
        funds: [
          { name: 'AlphaGrep', website: getWebsite('AlphaGrep'), city: 'Mumbai', region: 'Asia–Pacific' },
          { name: 'Da Vinci Trading', website: getWebsite('Da Vinci Trading'), city: 'Mumbai', region: 'Asia–Pacific' },
          { name: 'Hudson River Trading', website: getWebsite('Hudson River Trading'), city: 'Mumbai', region: 'Asia–Pacific' },
          { name: 'IMC Trading', website: getWebsite('IMC Trading'), city: 'Mumbai', region: 'Asia–Pacific' },
          { name: 'XTX Markets', website: getWebsite('XTX Markets'), city: 'Mumbai', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Shanghai',
        funds: [
          { name: 'ACT Group', website: getWebsite('ACT Group'), city: 'Shanghai', region: 'Asia–Pacific' },
          { name: 'Akuna Capital', website: getWebsite('Akuna Capital'), city: 'Shanghai', region: 'Asia–Pacific' },
          { name: 'AlphaGrep', website: getWebsite('AlphaGrep'), city: 'Shanghai', region: 'Asia–Pacific' },
          { name: 'Bondi Tech', website: getWebsite('Bondi Tech'), city: 'Shanghai', region: 'Asia–Pacific' },
          { name: 'Eclipse Trading', website: getWebsite('Eclipse Trading'), city: 'Shanghai', region: 'Asia–Pacific' },
          { name: 'Flow Traders', website: getWebsite('Flow Traders'), city: 'Shanghai', region: 'Asia–Pacific' },
          { name: 'Hudson River Trading', website: getWebsite('Hudson River Trading'), city: 'Shanghai', region: 'Asia–Pacific' },
          { name: 'Jump Trading', website: getWebsite('Jump Trading'), city: 'Shanghai', region: 'Asia–Pacific' },
          { name: 'Kronos Research', website: getWebsite('Kronos Research'), city: 'Shanghai', region: 'Asia–Pacific' },
          { name: 'Marshall Wace', website: getWebsite('Marshall Wace'), city: 'Shanghai', region: 'Asia–Pacific' },
          { name: 'Nine Mile', website: getWebsite('Nine Mile'), city: 'Shanghai', region: 'Asia–Pacific' },
          { name: 'SIG', website: getWebsite('SIG'), city: 'Shanghai', region: 'Asia–Pacific' },
          { name: 'Tower Research Capital', website: getWebsite('Tower Research Capital'), city: 'Shanghai', region: 'Asia–Pacific' },
          { name: 'Trexquant', website: getWebsite('Trexquant'), city: 'Shanghai', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Shenzhen',
        funds: [
          { name: 'Kronos Research', website: getWebsite('Kronos Research'), city: 'Shenzhen', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Singapore',
        funds: [
          { name: 'AlphaGrep', website: getWebsite('AlphaGrep'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Amber Group', website: getWebsite('Amber Group'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Balyasny Asset Management (BAM)', website: getWebsite('Balyasny Asset Management (BAM)'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Belvedere Trading', website: getWebsite('Belvedere Trading'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'BlockTech', website: getWebsite('BlockTech'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Cubist (Point72)', website: getWebsite('Cubist (Point72)'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'D. E. Shaw', website: getWebsite('D. E. Shaw'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'DRW', website: getWebsite('DRW'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Flow Traders', website: getWebsite('Flow Traders'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Genk Capital', website: getWebsite('Genk Capital'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Grasshopper', website: getWebsite('Grasshopper'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Graviton Research Capital', website: getWebsite('Graviton Research Capital'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Headlands Technology', website: getWebsite('Headlands Technology'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Hudson River Trading', website: getWebsite('Hudson River Trading'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Jump Trading', website: getWebsite('Jump Trading'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Keyrock', website: getWebsite('Keyrock'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Kronos Research', website: getWebsite('Kronos Research'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Mako Trading', website: getWebsite('Mako Trading'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Marshall Wace', website: getWebsite('Marshall Wace'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Mathrix', website: getWebsite('Mathrix'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Maverick Derivatives', website: getWebsite('Maverick Derivatives'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'NK Securities', website: getWebsite('NK Securities'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Old Mission Capital', website: getWebsite('Old Mission Capital'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Quadeye', website: getWebsite('Quadeye'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Quantbox Research', website: getWebsite('Quantbox Research'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Quantlab', website: getWebsite('Quantlab'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'SIG', website: getWebsite('SIG'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Squarepoint Capital', website: getWebsite('Squarepoint Capital'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Tower Research Capital', website: getWebsite('Tower Research Capital'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'VIRTU Financial', website: getWebsite('VIRTU Financial'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'Wintermute', website: getWebsite('Wintermute'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'XR Trading', website: getWebsite('XR Trading'), city: 'Singapore', region: 'Asia–Pacific' },
          { name: 'XTX Markets', website: getWebsite('XTX Markets'), city: 'Singapore', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Sydney',
        funds: [
          { name: 'AQR Capital Management', website: getWebsite('AQR Capital Management'), city: 'Sydney', region: 'Asia–Pacific' },
          { name: 'Akuna Capital', website: getWebsite('Akuna Capital'), city: 'Sydney', region: 'Asia–Pacific' },
          { name: 'Cubist (Point72)', website: getWebsite('Cubist (Point72)'), city: 'Sydney', region: 'Asia–Pacific' },
          { name: 'Eclipse Trading', website: getWebsite('Eclipse Trading'), city: 'Sydney', region: 'Asia–Pacific' },
          { name: 'Epoch Capital', website: getWebsite('Epoch Capital'), city: 'Sydney', region: 'Asia–Pacific' },
          { name: 'IMC Trading', website: getWebsite('IMC Trading'), city: 'Sydney', region: 'Asia–Pacific' },
          { name: 'Jump Trading', website: getWebsite('Jump Trading'), city: 'Sydney', region: 'Asia–Pacific' },
          { name: 'Mako Trading', website: getWebsite('Mako Trading'), city: 'Sydney', region: 'Asia–Pacific' },
          { name: 'Maven Securities', website: getWebsite('Maven Securities'), city: 'Sydney', region: 'Asia–Pacific' },
          { name: 'Nine Mile', website: getWebsite('Nine Mile'), city: 'Sydney', region: 'Asia–Pacific' },
          { name: 'SIG', website: getWebsite('SIG'), city: 'Sydney', region: 'Asia–Pacific' },
          { name: 'Tibra', website: getWebsite('Tibra'), city: 'Sydney', region: 'Asia–Pacific' },
          { name: 'VIRTU Financial', website: getWebsite('VIRTU Financial'), city: 'Sydney', region: 'Asia–Pacific' },
          { name: 'VivCourt Trading', website: getWebsite('VivCourt Trading'), city: 'Sydney', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Taipei',
        funds: [
          { name: 'Amber Group', website: getWebsite('Amber Group'), city: 'Taipei', region: 'Asia–Pacific' },
          { name: 'Cubist (Point72)', website: getWebsite('Cubist (Point72)'), city: 'Taipei', region: 'Asia–Pacific' },
          { name: 'Kronos Research', website: getWebsite('Kronos Research'), city: 'Taipei', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Tel Aviv',
        funds: [
          { name: 'Barak Capital', website: getWebsite('Barak Capital'), city: 'Tel Aviv', region: 'Asia–Pacific' },
        ]
      },
      {
        city: 'Tokyo',
        funds: [
          { name: 'Balyasny Asset Management (BAM)', website: getWebsite('Balyasny Asset Management (BAM)'), city: 'Tokyo', region: 'Asia–Pacific' },
          { name: 'Cubist (Point72)', website: getWebsite('Cubist (Point72)'), city: 'Tokyo', region: 'Asia–Pacific' },
          { name: 'Two Sigma', website: getWebsite('Two Sigma'), city: 'Tokyo', region: 'Asia–Pacific' },
        ]
      },
    ]
  },
]

// Flatten all funds for search
export const allFunds: Fund[] = fundsData.flatMap(region =>
  region.cities.flatMap(city => city.funds)
)

