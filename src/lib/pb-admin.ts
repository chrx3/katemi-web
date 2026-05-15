import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090');

// Auth
export async function adminLogin(email: string, password: string) {
  const auth = await pb.collection('_superusers').authWithPassword(email, password);
  return auth;
}

// Services
export async function getServices() {
  return pb.collection('services').getFullList({ sort: 'order' });
}
export async function createService(data: any) {
  return pb.collection('services').create(data);
}
export async function updateService(id: string, data: any) {
  return pb.collection('services').update(id, data);
}
export async function deleteService(id: string) {
  return pb.collection('services').delete(id);
}

// Projects
export async function getProjects() {
  return pb.collection('projects').getFullList({ sort: '-year' });
}
export async function createProject(data: any) {
  return pb.collection('projects').create(data);
}
export async function updateProject(id: string, data: any) {
  return pb.collection('projects').update(id, data);
}
export async function deleteProject(id: string) {
  return pb.collection('projects').delete(id);
}

// Clients
export async function getClients() {
  return pb.collection('clients').getFullList({ sort: 'order' });
}
export async function createClient(data: any) {
  return pb.collection('clients').create(data);
}
export async function updateClient(id: string, data: any) {
  return pb.collection('clients').update(id, data);
}
export async function deleteClient(id: string) {
  return pb.collection('clients').delete(id);
}

// SiteConfig
export async function getSiteConfig() {
  return pb.collection('siteConfig').getFullList();
}
export async function setSiteConfig(key: string, value: string) {
  try {
    const existing = await pb.collection('siteConfig').getFirstListItem(`key="${key}"`);
    return pb.collection('siteConfig').update(existing.id, { value });
  } catch {
    return pb.collection('siteConfig').create({ key, value });
  }
}

// Contacts
export async function getContacts() {
  return pb.collection('contacts').getFullList({ sort: '-created' });
}
