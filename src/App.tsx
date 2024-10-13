import React, { useState } from 'react';
import { Plus, UserPlus, Trash2, Users, Award, CheckCircle2, XCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VotingApp() {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Candidat 1', status: 'active' },
    { id: 2, name: 'Candidat 2', status: 'active' },
  ]);
  const [players, setPlayers] = useState([
    { id: 1, name: 'Joueur 1', points: 0, currentVote: null },
    { id: 2, name: 'Joueur 2', points: 0, currentVote: null },
  ]);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [votingPhase, setVotingPhase] = useState('voting');
  const [selectedElimination, setSelectedElimination] = useState(null);

  const addCandidate = () => {
    if (newCandidateName.trim()) {
      const newId = Math.max(...candidates.map(c => c.id), 0) + 1;
      setCandidates([...candidates, { id: newId, name: newCandidateName.trim(), status: 'active' }]);
      setNewCandidateName('');
    }
  };

  const removeCandidate = (id: number | null) => {
    setCandidates(candidates.filter(candidate => candidate.id !== id));
    setPlayers(players.map(player => 
      player.currentVote === id ? { ...player, currentVote: null } : player
    ));
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newId = Math.max(...players.map(p => p.id), 0) + 1;
      setPlayers([...players, { id: newId, name: newPlayerName.trim(), points: 0, currentVote: null }]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  /*const handleVote = (playerId: number, candidateId: string) => {
    setPlayers(players.map(player =>
      player.id === playerId ? { ...player, currentVote: parseInt(candidateId) } : player
    ));
  };*/

  const handleElimination = () => {
    if (selectedElimination) {
      setCandidates(candidates.map(candidate =>
        candidate.id === selectedElimination ? { ...candidate, status: 'eliminated' } : candidate
      ));
      
      setPlayers(players.map(player =>
        player.currentVote === selectedElimination
          ? { ...player, points: player.points + 1, currentVote: null }
          : { ...player, currentVote: null }
      ));
      
      setSelectedElimination(null);
      setVotingPhase('voting');
    }
  };

  const resetAll = () => {
    setCandidates(candidates.map(candidate => ({ ...candidate, status: 'active' })));
    setPlayers(players.map(player => ({ ...player, points: 0, currentVote: null })));
    setVotingPhase('voting');
    setSelectedElimination(null);
  };

  const activeCandidates = candidates.filter(c => c.status === 'active');

  function handleVote(id: number, value: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md mx-auto">
        <Tabs defaultValue="voting" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="voting" className="flex gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Vote
            </TabsTrigger>
            <TabsTrigger value="players" className="flex gap-2">
              <Users className="h-4 w-4" />
              Joueurs
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex gap-2">
              <Award className="h-4 w-4" />
              Candidats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="voting">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                {votingPhase === 'voting' ? 'Phase de Vote' : 'Phase d\'Élimination'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {votingPhase === 'voting' ? (
                <>
                  {players.map(player => (
                    <Card key={player.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{player.name}</h3>
                          <div className="text-sm">Points: {player.points}</div>
                        </div>
                        <Select
                          onValueChange={(value) => handleVote(player.id, value)}
                          value={player.currentVote == null ? "" : player.currentVote}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un candidat" />
                          </SelectTrigger>
                          <SelectContent>
                            {activeCandidates.map(candidate => (
                              <SelectItem key={candidate.id} value={candidate.id.toString()}>
                                {candidate.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button 
                    onClick={() => setVotingPhase('elimination')}
                    disabled={players.some(p => p.currentVote === null) || activeCandidates.length === 0}
                  >
                    Passer à l'élimination
                  </Button>
                </>
              ) : (
                <>
                  <Select
                    onValueChange={(value) => setSelectedElimination(null)}
                    value={selectedElimination == null ? "" : selectedElimination}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir le candidat éliminé" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeCandidates.map(candidate => (
                        <SelectItem key={candidate.id} value={candidate.id.toString()}>
                          {candidate.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={handleElimination}
                    disabled={!selectedElimination}
                  >
                    Confirmer l'élimination
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setVotingPhase('voting')}
                  >
                    Retour aux votes
                  </Button>
                </>
              )}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="players">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Gestion des Joueurs
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Nom du nouveau joueur"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={addPlayer}>
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
              
              {players.map(player => (
                <Card key={player.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{player.name}</h3>
                      <div className="font-bold">Points: {player.points}</div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full flex gap-2">
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer {player.name} ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removePlayer(player.id)}>
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </TabsContent>

          <TabsContent value="candidates">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Gestion des Candidats
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Nom du nouveau candidat"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={addCandidate}>
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
              
              {candidates.map(candidate => (
                <Card key={candidate.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{candidate.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-sm ${
                        candidate.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {candidate.status === 'active' ? 'Actif' : 'Éliminé'}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full flex gap-2">
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer {candidate.name} ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeCandidate(candidate.id)}>
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={resetAll}
            className="flex gap-2"
          >
            <XCircle className="h-4 w-4" />
            Réinitialiser tout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}