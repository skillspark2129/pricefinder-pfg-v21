import { supabase } from '@/lib/supabase';

export interface ComplaintInput {
  name: string;
  whatsapp: string;
  message: string;
  productLink: string | null;
}

export async function submitComplaint(input: ComplaintInput): Promise<void> {
  const { error } = await supabase.from('messages').insert({
    name: input.name,
    whatsapp: input.whatsapp,
    message: input.message,
    product_link: input.productLink,
    status: 'pending',
  });
  if (error) throw new Error(error.message);
}
