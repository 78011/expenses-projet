import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "./api";
import { ArrowDownCircle, ArrowUpCircle, Wallet, Activity, TrendingUp, TrendingDown, Trash, PlusCircle, SquarePen } from "lucide-react";

type Transaction = {
  id: string;
  text: string;
  amount: number;
  created_at: string;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [text, setText] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState<boolean>(false);
  
  // 1. NOUVEL ÉTAT : Permet de savoir quelle transaction on modifie
  const [editingId, setEditingId] = useState<string | null>(null);

  const getTransactions = () => {
    const fetchPromise = api.get<Transaction[]>("/transactions/").then((res) => {
      setTransactions(res.data);
    });

    toast.promise(fetchPromise, {
      loading: "Chargement des transactions...",
      success: "Transactions récupérées !",
      error: "Impossible de charger les données.",
    });
  }

  const deleteTransactions = (id: string) => {
    try {
      api.delete(`/transactions/${id}/`).then(() => {
        toast.success("Transaction supprimée !");
        getTransactions();
      });
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error("Erreur lors de la suppression.");
    }
  }

  // 2. NOUVELLE FONCTION : Préparer le modal pour la modification
  const editTransactions = (id: string) => {
    // On cherche la transaction correspondante dans notre state
    const transactionToEdit = transactions.find((t) => t.id === id);
    
    if (transactionToEdit) {
      setEditingId(id); // On enregistre l'ID
      setText(transactionToEdit.text); // On pré-remplit le texte
      setAmount(transactionToEdit.amount); // On pré-remplit le montant
      
      // On ouvre le modal
      const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
      if (modal) modal.showModal();
    }
  }

  // 3. NOUVELLE FONCTION : Préparer le modal pour un ajout (vide les champs)
  const openAddModal = () => {
    setEditingId(null);
    setText("");
    setAmount("");
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  // 4. FONCTION MODIFIÉE : Gère à la fois l'Ajout ET la Modification
  const saveTransaction = async () => {
    if (!text || amount === "" || isNaN(Number(amount))) {
      toast.error("Veuillez entrer une description et un montant valide.");
      return;
    }
    
    setLoading(true);
    
    try {
      if (editingId) {
        // MODE MODIFICATION (PUT ou PATCH selon ton backend Django)
        await api.put<Transaction>(`transactions/${editingId}/`, { 
          text, 
          amount: Number(amount) 
        });
        toast.success("Transaction modifiée avec succès !");
      } else {
        // MODE AJOUT (POST)
        await api.post<Transaction>("transactions/", { 
          text, 
          amount: Number(amount) 
        });
        toast.success("Transaction ajoutée avec succès !");
      }

      getTransactions(); // Rafraîchir la liste

      // Fermer le modal et réinitialiser
      const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
      if (modal) {
        modal.close(); 
        setText(""); 
        setAmount(""); 
        setEditingId(null); // On sort du mode édition
      } 
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    getTransactions();
  }, []);

  const amounts = transactions.map((t) => Number(t.amount) || 0)
  const balance = amounts.reduce((acc, item) => acc + item, 0) || 0
  const income = amounts.filter((a) => a > 0).reduce((acc, item) => acc + item, 0) || 0
  const expenses = amounts.filter((a) => a < 0).reduce((acc, item) => acc + item, 0) || 0
  const ratio = income > 0 ? Math.min((Math.abs(expenses) / income) * 100, 100) : 0
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit", month: "2-digit", year: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl flex flex-col gap-4"> 
          <div className="flex justify-between rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5">
            <div className="flex flex-col gap-1">
                <div className="badge badge-soft">
                  <Wallet size={16}/> Votre solde
              </div>
              <div className="stat-value text-xl font-bold">
                {balance.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </div>
            </div>
            <div className="flex flex-col gap-1">
                <div className="badge badge-soft badge-success">
                  <ArrowUpCircle size={16}/> Votre revenu
              </div>
              <div className="stat-value text-xl font-bold">
                {income.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </div>
            </div>
            <div className="flex flex-col gap-1">
                <div className="badge badge-soft badge-error">
                  <ArrowDownCircle size={16}/> Votre dépense
              </div>
              <div className="stat-value text-xl font-bold">
                {expenses.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5">
            <div className="flex justify-between items-center mb-1">
                <div className="badge badge-soft badge-warning gap-1 "> 
                  <Activity size={16}/> Dépenses / Revenus
                </div>
                <div>{ratio.toFixed(0)}%</div>
            </div>
              <progress className="progress progress-warning w-full" value={ratio} max={100} />
          </div>

        {/* Bouton d'ajout : utilise openAddModal au lieu de juste ouvrir le modal */}
        <button className="btn btn-warning" onClick={openAddModal}>
          <PlusCircle size={16}/> Ajouter une transaction
        </button>

        <div className="overflow-x-auto rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={t.id}>
                  <th>{index + 1}</th>
                  <td>{t.text}</td>
                  <td className="font-semibold flex items-center gap-1">
                    {t.amount > 0 
                      ? <TrendingUp className="text-success" size={24}/> 
                      : <TrendingDown className="text-error" size={24}/>
                    }
                    {t.amount > 0 ? `+${t.amount}` : `${t.amount}`}
                  </td>
                  <td>{formatDate(t.created_at)}</td>
                  <td>
                    <button 
                      onClick={() => editTransactions(t.id)}
                      className="btn btn-sm btn-primary btn-soft mr-2"
                      title="Modifier"
                    >
                      <SquarePen size={16}/>
                    </button>

                    <button 
                      onClick={() => deleteTransactions(t.id)}
                      className="btn btn-sm btn-error btn-soft"
                      title="Supprimer"
                    >
                      <Trash size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dialog id="my_modal_3" className="modal backdrop-blur">
          <div className="modal-box border-2 border-warning/10 border-dashed">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            
            {/* Titre dynamique selon le mode */}
            <h3 className="font-bold text-lg">
              {editingId ? "Modifier la transaction" : "Ajouter une transaction"}
            </h3>
            
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <label className="label">Texte</label>
                  <input 
                    type="text" 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Entrez le texte..."
                    className="input w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="label">Montant (négatif - dépense, positif - revenu)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Entrez le montant..."
                    className="input w-full"
                  />
                </div>

                {/* Bouton dynamique */}
                <button 
                  className="w-full btn btn-warning"
                  onClick={saveTransaction}
                  disabled={loading}
                >
                  {editingId ? <SquarePen size={16}/> : <PlusCircle size={16}/>}
                  {editingId ? "Enregistrer les modifications" : "Ajouter"}
                </button>
              </div>
          </div>
        </dialog>

        </div>
      </div>
    </>
  )
}

export default App;