from marshmallow_jsonschema import JSONSchema
from be.dto.paziente_dto import CreaPazienteDTO, AggiornaPazienteDTO, PazienteResponseDTO
from be.dto.contatti_dto import ContattiResponseDTO, CreaContattiDTO, AggiornaContattiDTO
from be.dto.residenza_dto import ResidenzaResponseDTO, CreaResidenzaDTO, AggiornaResidenzaDTO
from be.dto.medico_dto import CreaMedicoDTO, AggiornaMedicoDTO, MedicoResponseDTO
from be.dto.slot_dto import CreaSlotDTO, AggiornaSlotDTO, SlotResponseDTO
from be.dto.appuntamento_dto import AppuntamentoResponseDTO, AggiornaAppuntamentoDTO, CreaAppuntamentoDTO
from be.dto.analisi_psico_sociale_dto import AnalisiPsicoSocialeResponseDTO, AggiornaAnalisiPsicoSocialeDTO, CreaAnalisiPsicoSocialeDTO
from be.dto.anamnesi_familiare_dto import AnamnesiFamiliareResponseDTO, CreaAnamnesiFamiliareDTO, AggiornaAnamnesiFamiliareDTO
from be.dto.anamnesi_patologica_attuale_dto import AnamnesiPatologicaAttualeResponseDTO, CreaAnamnesiPatologicaAttualeDTO, AggiornaAnamnesiPatologicaAttualeDTO
from be.dto.anamnesi_patologica_remota_dto import AnamnesiPatologicaRemotaResponseDTO, CreaAnamnesiPatologicaRemotaDTO, AggiornaAnamnesiPatologicaRemotaDTO
from be.dto.farmaci_allergie_dto import FarmaciAllergieResponseDTO, FarmaciAllergieDTO, AggiornaFarmaciAllergieDTO
from be.dto.stato_fratelli_dto import StatoFratelliResponseDTO, StatoFratelliDTO, AggiornaStatoFratelliDTO
from be.dto.stato_genitori_dto import StatoGenitoriResponseDTO, StatoGenitoriDTO, AggiornaStatoGenitoriDTO

def defs_from_schemas(schemas):
    js = JSONSchema()
    defs = {}
    for schema_cls in schemas:
        schema = schema_cls()
        dumped = js.dump(schema)
        defs.update(dumped.get("definitions", {}))
    return defs

def get_swagger_definitions():
    
    pazienti_defs = defs_from_schemas([CreaPazienteDTO,AggiornaPazienteDTO, PazienteResponseDTO])
    contatti_defs = defs_from_schemas([ContattiResponseDTO, CreaContattiDTO, AggiornaContattiDTO])
    residenza_defs = defs_from_schemas([ResidenzaResponseDTO, CreaResidenzaDTO, AggiornaResidenzaDTO])
    medici_defs = defs_from_schemas([CreaMedicoDTO, AggiornaMedicoDTO, MedicoResponseDTO])
    slot_defs = defs_from_schemas([CreaSlotDTO, AggiornaSlotDTO, SlotResponseDTO])
    appuntamento_defs = defs_from_schemas([AppuntamentoResponseDTO, AggiornaAppuntamentoDTO, CreaAppuntamentoDTO])
    analisi_psico_sociale_defs = defs_from_schemas([AnalisiPsicoSocialeResponseDTO, AggiornaAnalisiPsicoSocialeDTO, CreaAnalisiPsicoSocialeDTO])
    anamnesi_familiare_defs = defs_from_schemas([AnamnesiFamiliareResponseDTO, CreaAnamnesiFamiliareDTO, AggiornaAnamnesiFamiliareDTO])
    anamnesi_patologica_attuale_defs = defs_from_schemas([AnamnesiPatologicaAttualeResponseDTO, CreaAnamnesiPatologicaAttualeDTO, AggiornaAnamnesiPatologicaAttualeDTO])
    anamnesi_patologica_remota_defs = defs_from_schemas([AnamnesiPatologicaRemotaResponseDTO, CreaAnamnesiPatologicaRemotaDTO, AggiornaAnamnesiPatologicaRemotaDTO])
    farmaci_allergie_defs = defs_from_schemas([FarmaciAllergieResponseDTO, FarmaciAllergieDTO, AggiornaFarmaciAllergieDTO])
    stato_fratelli_defs = defs_from_schemas([StatoFratelliResponseDTO, StatoFratelliDTO, AggiornaStatoFratelliDTO])
    stato_genitori_defs = defs_from_schemas([StatoGenitoriResponseDTO, StatoGenitoriDTO, AggiornaStatoGenitoriDTO])
    # altri_defs = defs_from_schemas([...])
    # unisci e ritorna
    all_defs = {}
    all_defs.update(pazienti_defs)
    all_defs.update(contatti_defs)
    all_defs.update(residenza_defs)
    all_defs.update(medici_defs)
    all_defs.update(slot_defs)
    all_defs.update(appuntamento_defs)
    all_defs.update(analisi_psico_sociale_defs)
    all_defs.update(anamnesi_familiare_defs)
    all_defs.update(anamnesi_patologica_attuale_defs)
    all_defs.update(anamnesi_patologica_remota_defs)
    all_defs.update(farmaci_allergie_defs)
    all_defs.update(stato_fratelli_defs)
    all_defs.update(stato_genitori_defs)
    # all_defs.update(altri_defs)
    return all_defs