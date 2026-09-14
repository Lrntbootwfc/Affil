/**
 * Comprehensive Industry Roles, Categories, Locations, and Link Validation Utilities
 */

export interface RoleCategory {
  category: string;
  roles: string[];
}

export const ROLE_CATEGORIES: RoleCategory[] = [
  {
    category: 'Cinematography & Camera',
    roles: [
      'Director of Photography (DP)',
      'Cinematographer',
      'Camera Operator (A-Cam / B-Cam)',
      '1st Assistant Camera (1st AC / Focus Puller)',
      '2nd Assistant Camera (2nd AC / Clapper Loader)',
      'Steadicam / Gimbal Specialist',
      'Drone Pilot / Aerial Cinematographer',
      'DIT (Digital Imaging Technician)',
    ],
  },
  {
    category: 'Writing, Directing & Producing',
    roles: [
      'Director',
      'Screenwriter / Scriptwriter',
      'Creative Producer',
      'Executive Producer',
      'Line Producer',
      '1st Assistant Director (1st AD)',
      '2nd Assistant Director (2nd AD)',
      'Script Supervisor / Continuity',
      'Story / Narrative Consultant',
    ],
  },
  {
    category: 'Lighting & Grip (Electric / Rigging)',
    roles: [
      'Gaffer / Chief Lighting Technician',
      'Best Boy Electric',
      'Key Grip',
      'Best Boy Grip',
      'Dolly Grip',
      'Rigging Gaffer',
    ],
  },
  {
    category: 'Sound & Audio Production',
    roles: [
      'Location Sound Recordist',
      'Boom Operator',
      'Sound Designer / Audio Recordist',
      'Re-recording Mixer / Audio Post Engineer',
      'Foley Artist',
      'Dialogue Editor',
      'Music Composer / Score Producer',
    ],
  },
  {
    category: 'Post-Production, Edit & Visual Effects',
    roles: [
      'Lead Video Editor',
      'Assistant Editor',
      'Colorist (DaVinci Resolve / Baselight)',
      'VFX Artist / Compositor',
      'Motion Graphics / 3D Artist',
      'CGI / Unreal Engine Virtual Production Artist',
    ],
  },
  {
    category: 'Art Department, Wardrobe & Design',
    roles: [
      'Production Designer',
      'Art Director',
      'Set Decorator / Prop Master',
      'Costume Designer / Stylist',
      'Key Makeup & Hair Artist (HMUA)',
      'SFX Makeup Artist',
      'UI/UX Designer',
      'Photographer / BTS Stills Photographer',
    ],
  },
];

// Flat list of all roles
export const ALL_ROLES: string[] = ROLE_CATEGORIES.flatMap((c) => c.roles);

// Verified Location Validation Helper
// Supports Indian hubs, US/Global production centers, plus remote/travel options
export const POPULAR_LOCATIONS: string[] = [
  // India Production Hubs
  'Mumbai, Maharashtra',
  'Bengaluru, Karnataka',
  'Delhi NCR / New Delhi',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Pune, Maharashtra',
  'Goa, India',
  'Kochi, Kerala',
  'Jaipur, Rajasthan',
  'Ahmedabad, Gujarat',
  'Chandigarh, India',
  
  // International Production Centers
  'Los Angeles, CA',
  'New York, NY',
  'London, UK',
  'Vancouver, Canada',
  'Atlanta, GA',
  'Toronto, Canada',
  'Berlin, Germany',
  'Tokyo, Japan',
  'Dubai, UAE',
  'Sydney, Australia',
  'Remote / Worldwide (Open to Travel)',
];

/**
 * Validate a location query string
 */
export function validateLocation(loc: string): { isValid: boolean; normalized: string; warning?: string } {
  if (!loc || !loc.trim()) {
    return { isValid: false, normalized: '', warning: 'Base location is required.' };
  }
  const clean = loc.trim();
  if (clean.length < 2) {
    return { isValid: false, normalized: clean, warning: 'Please enter a valid city and state/country.' };
  }
  // Check if string contains reasonable location characters (letters, commas, periods, spaces, slashes)
  const isPlausible = /^[a-zA-Z\s,./()\-&']+$/.test(clean) && clean.replace(/[^a-zA-Z]/g, '').length >= 3;
  return {
    isValid: isPlausible,
    normalized: clean,
    warning: isPlausible ? undefined : 'Please enter a recognizable city, region, or state.',
  };
}

/**
 * Social Media & URL validation helpers
 */
export function validateSocialUrl(
  platform: 'linkedin' | 'instagram' | 'facebook' | 'pinterest' | 'twitter' | 'custom' | 'workLink',
  input: string
): { isValid: boolean; formattedUrl: string; error?: string } {
  if (!input || !input.trim()) {
    return { isValid: true, formattedUrl: '' };
  }

  let url = input.trim();

  // If user entered handle without protocol/domain, format it properly
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (platform === 'instagram') {
      const handle = url.replace(/^@/, '');
      url = `https://instagram.com/${handle}`;
    } else if (platform === 'linkedin') {
      const handle = url.replace(/^@/, '');
      if (handle.startsWith('linkedin.com/')) {
        url = `https://${handle}`;
      } else {
        url = `https://linkedin.com/in/${handle}`;
      }
    } else if (platform === 'facebook') {
      const handle = url.replace(/^@/, '');
      url = `https://facebook.com/${handle}`;
    } else if (platform === 'pinterest') {
      const handle = url.replace(/^@/, '');
      url = `https://pinterest.com/${handle}`;
    } else if (platform === 'twitter') {
      const handle = url.replace(/^@/, '');
      url = `https://x.com/${handle}`;
    } else {
      url = `https://${url}`;
    }
  }

  // General URL regex test
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;
  if (!urlPattern.test(url)) {
    return {
      isValid: false,
      formattedUrl: url,
      error: `Invalid URL format for ${platform}. Please provide a valid link.`,
    };
  }

  // Domain specific check
  if (platform === 'instagram' && !url.toLowerCase().includes('instagram.com')) {
    return { isValid: false, formattedUrl: url, error: 'Must be an Instagram URL (instagram.com/yourhandle).' };
  }
  if (platform === 'linkedin' && !url.toLowerCase().includes('linkedin.com')) {
    return { isValid: false, formattedUrl: url, error: 'Must be a LinkedIn URL (linkedin.com/in/username).' };
  }
  if (platform === 'facebook' && !url.toLowerCase().includes('facebook.com') && !url.toLowerCase().includes('fb.com')) {
    return { isValid: false, formattedUrl: url, error: 'Must be a Facebook URL (facebook.com/username).' };
  }
  if (platform === 'pinterest' && !url.toLowerCase().includes('pinterest.com')) {
    return { isValid: false, formattedUrl: url, error: 'Must be a Pinterest URL (pinterest.com/username).' };
  }
  if (platform === 'twitter' && !url.toLowerCase().includes('twitter.com') && !url.toLowerCase().includes('x.com')) {
    return { isValid: false, formattedUrl: url, error: 'Must be an X/Twitter URL (x.com/username).' };
  }

  return { isValid: true, formattedUrl: url };
}
