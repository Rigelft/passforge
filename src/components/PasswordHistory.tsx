import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { CopyIcon, EyeIcon, TrashIcon } from "@/components/icons";
import { useToast } from "@/components/ToastProvider";
import ui from "@/components/ui.module.css";
import { copyToClipboard } from "@/lib/clipboard";
import type { PasswordHistoryItem } from "@/types";
import styles from "@/components/passwordHistory.module.css";

type Props = {
  items: PasswordHistoryItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
};

const ITEMS_PER_PAGE = 5;

function maskPassword(p: string) {
  if (!p) return "";
  if (p.length <= 6) return "•".repeat(p.length);
  const start = p.slice(0, 2);
  const end = p.slice(-2);
  return `${start}${"•".repeat(Math.min(18, p.length - 4))}${end}`;
}

export function PasswordHistory({ items, onRemove, onClear }: Props) {
  const toast = useToast();
  const [page, setPage] = useState(1);

  const [revealItem, setRevealItem] = useState<PasswordHistoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<PasswordHistoryItem | null>(null);
  const [clearAllOpen, setClearAllOpen] = useState(false);

  const pageCount = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount));
  }, [pageCount]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, page]);

  async function copy(text: string) {
    const ok = await copyToClipboard(text);
    if (ok) toast.push("Copié.", "success");
    else toast.push("Impossible de copier automatiquement.", "danger");
  }

  return (
    <div className={ui.card}>
      <div className={ui.cardHeader}>
        <div className={styles.headerRow}>
          <div>
            <h2 className={ui.cardTitle}>Historique</h2>
            <p className={ui.cardSubtitle}>
              Stocké localement (localStorage). Vous pouvez supprimer quand vous voulez.
            </p>
          </div>
          <button
            className={`${ui.btn} ${ui.btnDanger}`}
            onClick={() => setClearAllOpen(true)}
            disabled={!items.length}
          >
            Tout effacer
          </button>
        </div>
      </div>

      <div className={ui.cardBody}>
        {!items.length ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>Aucun mot de passe enregistré.</div>
            <div className={styles.emptyText}>Générez un mot de passe pour le retrouver ici.</div>
          </div>
        ) : (
          <>
            <div className={styles.list} role="list">
              {pageItems.map((it) => (
                <div className={styles.item} key={it.id} role="listitem">
                  <div className={styles.itemMain}>
                    <div className={styles.account}>{it.accountName ?? "—"}</div>
                    <div className={`${styles.preview} ${ui.mono}`}>{maskPassword(it.password)}</div>
                    <div className={styles.meta}>
                      {new Date(it.createdAt).toLocaleString("fr-FR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button className={styles.iconBtn} onClick={() => copy(it.password)} aria-label="Copier">
                      <CopyIcon />
                    </button>
                    <button
                      className={styles.iconBtn}
                      onClick={() => setRevealItem(it)}
                      aria-label="Afficher le mot de passe"
                    >
                      <EyeIcon />
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.danger}`}
                      onClick={() => setDeleteItem(it)}
                      aria-label="Supprimer"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.pagination}>
              <button className={ui.btn} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                Précédent
              </button>
              <span className={styles.pageLabel}>
                Page {page} / {pageCount}
              </span>
              <button
                className={ui.btn}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page >= pageCount}
              >
                Suivant
              </button>
            </div>
          </>
        )}
      </div>

      <Modal
        open={!!revealItem}
        title={revealItem?.accountName?.trim() ? `Compte: ${revealItem.accountName}` : "Mot de passe"}
        onClose={() => setRevealItem(null)}
        actions={
          <>
            <button className={ui.btn} onClick={() => setRevealItem(null)}>
              Fermer
            </button>
            <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={() => copy(revealItem?.password ?? "")}>
              Copier
            </button>
          </>
        }
      >
        <div className={styles.reveal}>
          <div className={`${styles.revealValue} ${ui.mono}`}>{revealItem?.password}</div>
        </div>
      </Modal>

      <Modal
        open={!!deleteItem}
        title="Supprimer ce mot de passe ?"
        onClose={() => setDeleteItem(null)}
        actions={
          <>
            <button className={ui.btn} onClick={() => setDeleteItem(null)}>
              Annuler
            </button>
            <button
              className={`${ui.btn} ${ui.btnDanger}`}
              onClick={() => {
                if (!deleteItem) return;
                onRemove(deleteItem.id);
                setDeleteItem(null);
                toast.push("Supprimé.", "warning");
              }}
            >
              Supprimer
            </button>
          </>
        }
      >
        <div className={styles.deleteText}>
          {deleteItem?.accountName ? (
            <>
              Compte: <strong>{deleteItem.accountName}</strong>
            </>
          ) : (
            "Ce mot de passe sera retiré de l’historique."
          )}
        </div>
      </Modal>

      <Modal
        open={clearAllOpen}
        title="Effacer tout l’historique ?"
        onClose={() => setClearAllOpen(false)}
        actions={
          <>
            <button className={ui.btn} onClick={() => setClearAllOpen(false)}>
              Annuler
            </button>
            <button
              className={`${ui.btn} ${ui.btnDanger}`}
              onClick={() => {
                onClear();
                setClearAllOpen(false);
                toast.push("Historique effacé.", "warning");
              }}
            >
              Tout effacer
            </button>
          </>
        }
      >
        <div className={styles.deleteText}>
          Cette action supprime définitivement tous les mots de passe enregistrés dans ce navigateur.
        </div>
      </Modal>
    </div>
  );
}
