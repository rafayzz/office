'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Asset } from '@/lib/types';
import { absoluteAssetUrl } from '@/lib/utils';

export function AssetQrLabel({ asset }: { asset: Asset }) {
  if (!asset.qrEnabled) {
    return (
      <div className="rounded-2xl border border-dashed bg-muted/40 p-5 text-sm text-muted-foreground">
        QR is disabled for this asset. Enable QR only for assets that need scan-based lookup.
      </div>
    );
  }

  const value = absoluteAssetUrl(asset.id);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border bg-white p-5 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">OfficeOS Asset</p>
            <h3 className="mt-2 text-lg font-semibold">{asset.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{asset.assetId}</p>
          </div>
          <Badge variant="success">QR enabled</Badge>
        </div>
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="rounded-2xl border bg-white p-3">
            <QRCodeCanvas value={value} size={132} includeMargin />
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Serial number</p>
              <p className="font-medium">{asset.serialNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-medium">{asset.location}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Scan destination</p>
              <p className="break-all text-muted-foreground">{value}</p>
            </div>
          </div>
        </div>
      </div>
      <Button variant="outline" onClick={() => window.print()}>Print asset label</Button>
    </div>
  );
}
