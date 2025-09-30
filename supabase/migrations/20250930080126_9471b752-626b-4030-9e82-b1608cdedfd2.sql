-- Create enum types
CREATE TYPE user_role AS ENUM ('tenant', 'landlord');
CREATE TYPE request_type AS ENUM ('extension', 'move_out', 'maintenance');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE receipt_status AS ENUM ('pending', 'verified', 'rejected');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'tenant',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  room_number TEXT NOT NULL,
  monthly_rent DECIMAL(10, 2) NOT NULL DEFAULT 1200.00,
  total_contract_amount DECIMAL(10, 2) NOT NULL DEFAULT 14400.00,
  paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  contract_duration_months INTEGER NOT NULL DEFAULT 12,
  guarantor_name TEXT,
  guarantor_phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create receipts table
CREATE TABLE public.receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_month TEXT NOT NULL,
  payment_date DATE NOT NULL,
  status receipt_status NOT NULL DEFAULT 'pending',
  landlord_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- Create requests table
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  request_type request_type NOT NULL,
  message TEXT NOT NULL,
  status request_status NOT NULL DEFAULT 'pending',
  landlord_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create properties table for landlord settings
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_name TEXT NOT NULL,
  default_monthly_rent DECIMAL(10, 2) NOT NULL DEFAULT 1200.00,
  default_contract_months INTEGER NOT NULL DEFAULT 12,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create storage bucket for receipts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', false);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Landlords can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'landlord'
    )
  );

-- Tenants policies
CREATE POLICY "Tenants can view own data"
  ON public.tenants FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Tenants can update own data"
  ON public.tenants FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Landlords can view all tenants"
  ON public.tenants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'landlord'
    )
  );

CREATE POLICY "Landlords can insert tenants"
  ON public.tenants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'landlord'
    )
  );

CREATE POLICY "Landlords can update tenants"
  ON public.tenants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'landlord'
    )
  );

-- Receipts policies
CREATE POLICY "Tenants can view own receipts"
  ON public.receipts FOR SELECT
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can insert own receipts"
  ON public.receipts FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can view all receipts"
  ON public.receipts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'landlord'
    )
  );

CREATE POLICY "Landlords can update receipts"
  ON public.receipts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'landlord'
    )
  );

-- Requests policies
CREATE POLICY "Tenants can view own requests"
  ON public.requests FOR SELECT
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can insert own requests"
  ON public.requests FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can view all requests"
  ON public.requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'landlord'
    )
  );

CREATE POLICY "Landlords can update requests"
  ON public.requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'landlord'
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (recipient_id = auth.uid());

CREATE POLICY "Anyone authenticated can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Properties policies
CREATE POLICY "Landlords can manage properties"
  ON public.properties FOR ALL
  USING (landlord_id = auth.uid());

-- Storage policies for receipts
CREATE POLICY "Tenants can upload receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Tenants can view own receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Landlords can view all receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'landlord'
    )
  );

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'tenant')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();