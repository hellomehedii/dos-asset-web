-- Create storage bucket for CMS images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-images', 'cms-images', true);

-- Allow public read access to CMS images
CREATE POLICY "Public can view CMS images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'cms-images');

-- Allow admins/editors to upload images
CREATE POLICY "Admins and editors can upload CMS images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'cms-images' 
    AND public.is_admin_or_editor(auth.uid())
);

-- Allow admins/editors to update images
CREATE POLICY "Admins and editors can update CMS images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'cms-images' 
    AND public.is_admin_or_editor(auth.uid())
);

-- Allow admins/editors to delete images
CREATE POLICY "Admins and editors can delete CMS images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'cms-images' 
    AND public.is_admin_or_editor(auth.uid())
);